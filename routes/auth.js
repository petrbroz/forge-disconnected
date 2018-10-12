const express = require('express');

const { AuthenticationClient } = require('autodesk-forge-tools');

let router = express.Router();
let auth = new AuthenticationClient(process.env.FORGE_CLIENT_ID, process.env.FORGE_CLIENT_SECRET);

// GET /api/token
// Gets a 2-legged authentication token.
router.get('/api/token', async function(req, res, next) {
    try {
        const authentication = await auth.authenticate(['viewables:read']);
        res.json(authentication);
    } catch(err) {
        next(err);
    }
});

module.exports = router;