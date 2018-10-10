const express = require('express');
const path = require('path');

const { AuthenticationClient, DataManagementClient } = require('autodesk-forge-tools');

let auth = new AuthenticationClient(process.env.FORGE_CLIENT_ID, process.env.FORGE_CLIENT_SECRET);
let data = new DataManagementClient(auth);
let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/token', async function(req, res, next) {
    try {
        const authentication = await auth.authenticate(['viewables:read']);
        res.json(authentication);
    } catch(err) {
        next(err);
    }
});
app.get('/api/models', async function(req, res, next) {
    try {
        let objects = [];
        for await (const page of data.objects(process.env.FORGE_BUCKET)) {
            objects.push(...page);
        }
        res.json(objects);
    } catch(err) {
        next(err);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });