const express = require('express');

const app = express();



app.use(require("./login"))

app.use(require("./usuarios"))

app.use(require('./categorias'))




module.exports = app;