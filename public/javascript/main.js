const AccessTokenEndpoint = '/api/token'; // Use your own endpoint here
const ListModelsEndpoint = '/api/models'; // Use your own endpoint here

let currentApp = null; // Viewing application
let currentUrn = null; // Currently open URN
let accessToken = null; // Access token used by the viewer

const options = {
	env: 'AutodeskProduction',
	getAccessToken: function(callback) {
		fetch(AccessTokenEndpoint)
		    .then((response) => response.json())
		    .then((json) => {
                accessToken = json.access_token;
                callback(json.access_token, 15 * 60 /* use token for 15 min */);
            });
	}
};

Autodesk.Viewing.Initializer(options, () => {
	currentApp = new Autodesk.Viewing.ViewingApplication('viewer');
	currentApp.registerViewer(currentApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
    initOverlay();
    updateOverlay();
    initServiceWorker();
});

/**
 * Initializes the overlay UI.
 */
function initOverlay() {
    // Handle clicks on the list of viewable models
    document.querySelector('#models').addEventListener('click', (ev) => {
        const action = ev.target.getAttribute('data-action');
        const urn = ev.target.parentNode.getAttribute('data-urn');
        if (urn && action) {
            switch (action) {
                case 'open': loadModel(urn); break;
                case 'cache': cacheModel(urn); break;
                case 'clear': clearCache(urn); break;
            }
        }
    });

    // Enable toggling of the debug info
    document.getElementById('debug-toggle').addEventListener('click', (ev) => {
        const table = document.getElementById('debug');
        if (table.style.getPropertyValue('display') !== 'none') {
            ev.target.innerHTML = 'Debug ▼';
            table.style.setProperty('display', 'none');
        } else {
            ev.target.innerHTML = 'Debug ▲';
            table.style.removeProperty('display');
        }
    });

    // Update debug info as soon as service worker is ready
    navigator.serviceWorker.ready.then(() => {
        document.getElementById('debug-ready').innerHTML = 'true';
    });
}

/**
 * Updates the overlay UI.
 */
function updateOverlay() {
    // If [Storage Manager API](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager)
    // is available, update the used/quota numbers
    if ('storage' in navigator) {
        navigator.storage.estimate().then(function(estimate) {
            const usage = (estimate.usage / Math.pow(2, 20)).toFixed(2);
            const quota = (estimate.quota / Math.pow(2, 20)).toFixed(2);
            document.getElementById('debug-quota').innerHTML = `${usage}MB/${quota}MB`;
        });
    }

    // Update the number of cached URLs
    submitWorkerTask({ operation: 'LIST_CACHES' })
        .then((res) => {
            document.getElementById('debug-cached').innerHTML = res.urls.length;
            console.log('Cached requests', res);
        })
        .catch((err) => {
            document.getElementById('debug-cached').innerHTML = 'N/A';
            console.error('Cached requests could not be listed', err);
        });

    // Update list of viewable models
    fetch(ListModelsEndpoint)
        .then((response) => response.json())
        .then((objects) => {
            document.querySelector('#models').innerHTML = objects.map(function(object) {
                let urn = btoa(object.objectId);
                while (urn.endsWith('=')) { urn = urn.substr(0, urn.length - 1); } // Trim the '=' padding at the end
                const cached = localStorage.getItem(urn); // Check local storage if this URN has been cached
                const active = urn === currentUrn;
                const online = ('onLine' in navigator) ? navigator.onLine : true;
                return `
                    <li class="${active ? 'active' : ''}" data-urn="${urn}">
                        <div class="model-name" data-action="open">${object.objectKey}</div>
                        <div class="model-status" style="display:${(active && online) || cached ? 'inline' : 'none'};" data-action="${cached ? 'clear' : 'cache'}">${cached ? '★' : '☆'}</div>
                    </li>
                `;
            }).join('\n');
        });
}

/**
 * Loads a Forge document into the viewer. Returns a promise that resolves
 * after the model has been loaded and the Autodesk.Viewing.GEOMETRY_LOADED_EVENT
 * event has triggered.
 */
function loadModel(urn) {
    let viewerError = document.getElementById('viewer-error');
    if (viewerError) {
        viewerError.parentNode.removeChild(viewerError);
    }

    function onDocumentLoadSuccess() {
        const viewables = currentApp.bubble.search({ 'type': 'geometry' });
        currentApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFailure); // Assuming there's always at least one viewable
    }
    function onDocumentLoadFailure() {
        viewerError = document.createElement('div');
        viewerError.id = 'viewer-error';
        viewerError.innerHTML = '<span>Could not load document. Are you offline?</span>';
        document.getElementById('viewer').appendChild(viewerError);
        updateOverlay();
        console.error('Could not load document ' + urn);
    }
    function onItemLoadSuccess(viewer) {
        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
            currentUrn = urn;
            updateOverlay();
        });
    }
    function onItemLoadFailure() {
        updateOverlay();
        console.error('Could not load model from document ' + urn);
    }
    currentUrn = null;
    const status = document.querySelector(`#overlay > ul > li[data-urn="${urn}"] > .model-status`);
    status.style.setProperty('display', 'inline');
    status.innerHTML = '(loading...)';
    currentApp.loadDocument('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
}

/**
 * Asks service worker to cache given URN.
 */
function cacheModel(urn) {
    document.querySelector(`#overlay > ul > li[data-urn="${urn}"] > .model-status`).innerHTML = '(caching...)';
    submitWorkerTask({ operation: 'CACHE_URN', urn: urn, access_token: accessToken })
        .then((res) => {
            console.log('Model cached successfully', res);
            localStorage.setItem(urn, 'cached'); // Mark the urn as cached in local storage
            updateOverlay();
        })
        .catch((err) => {
            console.error('Could not cache model', err);
            updateOverlay();
        });
}

/**
 * Asks service worker to clear all cached requests related to given URN.
 */
function clearCache(urn) {
    document.querySelector(`#overlay > ul > li[data-urn="${urn}"] > .model-status`).innerHTML = '(clearing...)';
    submitWorkerTask({ operation: 'CLEAR_URN', urn: urn })
        .then((res) => {
            console.log('Model cache cleared successfully', res);
            localStorage.removeItem(urn);
            updateOverlay();
        })
        .catch((err) => {
            console.error('Could not be clear model cache', err);
            updateOverlay();
        });
}

/**
 * Initializes service worker.
 */
function initServiceWorker() {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function(reg) { console.log('Service worker registered', reg.scope); })
        .catch(function(err) { console.error('Could not register service worker', err); });
}

/**
 * Sends a "task" message to the service worker.
 * Returns a promise that resolves when the service worker
 * replies with confirmation of completing the task.
 */
function submitWorkerTask(task) {
    return navigator.serviceWorker.ready.then(function(req) {
        return new Promise(function(resolve, reject) {
            const channel = new MessageChannel();
            channel.port1.onmessage = function(event) {
                if (event.data.error) {
                    reject(event.data);
                } else {
                    resolve(event.data);
                }
            };
            req.active.postMessage(task, [channel.port2]);
        });
    });
}