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