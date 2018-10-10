const CACHE_NAME = 'forge-disconnected-v2';
const MODEL_DERIVATIVE_PATH = 'developer.api.autodesk.com/derivativeservice/v2';

const STATIC_URLS = [
    '/',
    '/index.html',
    '/fonts/Artifakt_Element_Regular.woff2',
    '/images/forge-logo.png',
    '/javascript/main.js',
    '/stylesheets/main.css',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/style.css',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.js',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/lmvworker.js',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/locales/en/allstrings.json'
];

const API_URLS = [
    '/api/token',
    '/api/models'
];

// NOTE: worker state should ideally be persisted somewhere (IndexedDB),
// but for now we just keep it in memory for the duration of the worker's lifecycle.
let config = {
    recent: new Set() // Collection of recently visited Model Derivative API endpoints
};

self.addEventListener('install', function(event) {
    console.log('Install event', event);
    event.waitUntil(installAsync(event));
});

self.addEventListener('activate', function(event) {
    console.log('Activate event', event);
    event.waitUntil(activateAsync());
});

self.addEventListener('fetch', function(event) {
    console.log('Fetch event', event.request.url);
    event.respondWith(fetchAsync(event));
});

self.addEventListener('error', function(event) {
    console.error('Error event', event);
});

self.addEventListener('message', function(event) {
    console.log('Message event', event.data);
    messageAsync(event);
});

async function installAsync(event) {
    self.skipWaiting(); // Replace old service workers without waiting for them to wrap up
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_URLS);
    await cache.addAll(API_URLS);
}

async function activateAsync() {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    console.log('Claiming clients', clients.map(client => client.url).join(','));
    await self.clients.claim();
}

async function fetchAsync(event) {
    const match = await caches.match(event.request);
    if (match) {
        // Try and update the cache while we're returning the match
        caches.open(CACHE_NAME)
            .then((cache) => cache.add(event.request))
            .catch((err) => console.log('Cache not updated, but that\'s ok...', err));
        return match;
    }

    // If this is a request to Model Derivative API, remember the url
    // in case we want to cache it later
    if (event.request.url.includes(MODEL_DERIVATIVE_PATH)) {
        config.recent.add(event.request.url);
    }

    return fetch(event.request);
}

async function messageAsync(event) {
    switch (event.data.operation) {
        case 'CACHE_URN':
            try {
                const urls = await cacheUrn(event.data.urn, event.data.access_token);
                event.ports[0].postMessage({ status: 'ok', urls });
            } catch(err) {
                event.ports[0].postMessage({ error: err.toString() });
            }
            break;
        case 'CLEAR_URN':
            try {
                const urls = await clearUrn(event.data.urn);
                event.ports[0].postMessage({ status: 'ok', urls });
            } catch(err) {
                event.ports[0].postMessage({ error: err.toString() });
            }
            break;
        case 'LIST_CACHES':
            try {
                const urls = await listCached();
                event.ports[0].postMessage({ status: 'ok', urls });
            } catch(err) {
                event.ports[0].postMessage({ error: err.toString() });
            }
            break;
    }
}

async function cacheUrn(urn, access_token) {
    console.log('Caching', urn);
    const cache = await caches.open(CACHE_NAME);

    // Just to be safe, update the static URLs, too
    await cache.addAll(STATIC_URLS);
    await cache.addAll(API_URLS);

    const urls = Array.from(config.recent).filter(entry => entry.includes(urn));
    await Promise.all(urls.map((url) => {
        return fetch(url, { headers: { 'Authorization': 'Bearer ' + access_token } })
            .then((response) => {
                if (response.ok) {
                    return cache.put(url, response);
                } else {
                    throw new Error(response.statusText);
                }
            });
    }));
    return urls;
}

async function clearUrn(urn) {
    console.log('Clearing cache', urn);
    const cache = await caches.open(CACHE_NAME);
    const requests = (await cache.keys()).filter(req => req.url.includes(urn));
    await Promise.all(requests.map(req => cache.delete(req)));
    return requests.map(req => req.url);
}

async function listCached() {
    console.log('Listing caches');
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    return requests.map(req => req.url);
}