const CACHE_NAME = 'forge-disconnected-v3';
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
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/locales/en/allstrings.json',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/CityNight_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/CityNight_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/CoolLight_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/CoolLight_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/DarkSky_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/DarkSky_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/GreyRoom_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/GreyRoom_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/GridLight_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/GridLight_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Harbor_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Harbor_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/IDViz_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/IDViz_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/InfinityPool_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/InfinityPool_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Night_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Night_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Parking_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Parking_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/PhotoBooth_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/PhotoBooth_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Plaza_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Plaza_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Reflection_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/Reflection_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/RimHighlights_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/RimHighlights_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/RiverRoad_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/RiverRoad_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SharpHighlights_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SharpHighlights_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SnowField_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SnowField_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SoftLight_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/SoftLight_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/TranquilityBlue_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/TranquilityBlue_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/WarmLight_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/WarmLight_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/boardwalk_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/boardwalk_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/crossroads_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/crossroads_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/field_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/field_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/glacier_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/glacier_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/riverbank_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/riverbank_mipdrop.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/seaport_irr.logluv.dds',
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/res/environments/seaport_mipdrop.logluv.dds'
];

const API_URLS = [
    '/api/token',
    '/api/models'
];

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
    const match = await caches.match(event.request.url, { ignoreSearch: true });
    // If there's a match, return it
    if (match) {
        // If this is a static asset or known API, try updating the cache as well
        if (STATIC_URLS.includes(event.request.url) || API_URLS.includes(event.request.url)) {
            caches.open(CACHE_NAME)
                .then((cache) => cache.add(event.request))
                .catch((err) => console.log('Cache not updated, but that\'s ok...', err));
        }
        return match;
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
    // First, ask our server for all derivatives in this URN, and their file URLs
    const baseUrl = 'https://developer.api.autodesk.com/derivativeservice/v2';
    const res = await fetch(`/api/models/${urn}/files`);
    const derivatives = await res.json();
    // Prepare fetch requests to cache all the URLs
    const cache = await caches.open(CACHE_NAME);
    const options = { headers: { 'Authorization': 'Bearer ' + access_token } };
    const fetches = [];
    const manifestUrl = `${baseUrl}/manifest/${urn}`;
    fetches.push(fetch(manifestUrl, options).then(resp => cache.put(manifestUrl, resp)).then(() => manifestUrl));
    for (const derivative of derivatives) {
        const derivUrl = baseUrl + '/derivatives/' + encodeURIComponent(derivative.urn);
        fetches.push(fetch(derivUrl, options).then(resp => cache.put(derivUrl, resp)).then(() => derivUrl));
        for (const file of derivative.files) {
            const fileUrl = baseUrl + '/derivatives/' + encodeURIComponent(derivative.basePath + file);
            fetches.push(fetch(fileUrl, options).then(resp => cache.put(fileUrl, resp)).then(() => fileUrl));
        }
    }
    // Fetch and cache all URLs in parallel
    const urls = await Promise.all(fetches);
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