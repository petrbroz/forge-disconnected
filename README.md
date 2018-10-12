# forge-disconnected

Sample [Autodesk Forge](https://forge.autodesk.com/) application using
[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
and [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) APIs to provide
a limited offline support, allowing you to cache selected models and view them
without internet connection. Live demo is available at https://forge-offline.herokuapp.com.

## Running locally

- Install dependencies: `npm install`
- Define your `FORGE_CLIENT_ID`, `FORGE_CLIENT_SECRET`, and `FORGE_BUCKET` env. variables
- Run the server: `npm start`
- Go to [localhost:3000](http://localhost:3000)
- After loading one of the example models, you should see a `☆` symbol next to its name,
indicating that the model can now be cached
- Click the `☆` symbol; after a moment it should change to `★`, indicating that the model
has now been successfully cached
- Go offline and open any of the models with `★` next to their name
- Click on any of the `★` symbols to clear the cache for the corresponding model

## Caching strategy

Static assets and known APIs are cached immediately when the service worker is installed,
see the `STATIC_URLS` and `API_URLS` constants in the worker script.

> Note that in our case we only cache a subset of the viewer's assets, e.g., only two
environments are cached: _Sharp Highlighs_ and _Boardwalk_. If you want to include
other static assets, perhaps including your own viewer extensions, don't forget
to include them in the list.

A single document in Forge typically generates multiple derivatives, and derivatives
themselves often reference additional assets. We need a way to identify these assets
in order to cache them when needed. In this sample application, the server provides
a `GET /api/models/:urn/files` endpoint which is inspired by https://extract.autodesk.io
and - given a document URN - provides a list of URLS for all derivatives and their assets.

## Known issues & gotchas

- Service workers are only enabled in HTTPS context; one exception to this
is when serving from localhost in which case it can be HTTP
    - At one point during the development, I noticed that the service
    workers were not enabled in Google Chrome when served from http://localhost;
    as of now (with Chrome version 69.0.3497.100), localhost is working fine again
- Service worker can only manage requests in its own subpath; for example,
if you serve your service worker script from _/javascript/service-worker.js_,
it won't be able to intercept requests to _/stylesheets/main.css_