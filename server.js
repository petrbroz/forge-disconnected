const express = require('express');
const path = require('path');

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./routes/auth'));
app.use(require('./routes/data'));

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });