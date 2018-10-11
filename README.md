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

Every URN typically references a number of external files that are not known beforehand,
so we need a way to identify all these files in order to cache them when needed.
In this sample application, the service worker is collecting a list of all recent
requests with `developer.api.autodesk.com/derivativeservice/v2` in their URL.
Later on, when we want to cache a specific URN, we send a message to the service worker,
asking it to cache all the recently visited URLs related to this URN string.
Similarly, when we want to clear the cache for a specific URN, we ask the service worker
to remove all cached URLs with the URN string in them.

One of the obvious disadvantages of this approach is that you have to load
the model in the viewer before being able to cache it. A possible solution
to avoid this problem would be to mimic the viewer's loading logic
(or leverage the viewer's loading code if it was available via some API),
and define a list of all URLs needed for a specific URN document.
This list could then be sent to the service worker and cached.

## Known issues & gotchas

- Service workers are only enabled in HTTPS context; one exception to this
is when serving from localhost in which case it can be HTTP
    - At one point during the development, I noticed that the service
    workers were not enabled in Google Chrome when served from http://localhost;
    as of now (with Chrome version 69.0.3497.100), localhost is working fine again
- Service worker can only manage requests in its own subpath; for example,
if you serve your service worker script from _/javascript/service-worker.js_,
it won't be able to detect requests to _/stylesheets/main.css_