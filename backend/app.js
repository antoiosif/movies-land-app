const express = require('express');
const app = express();
const user = require('./routes/user.routes');
const { errorHandler } = require('./middlewares/error-handler.middleware');

app.use(express.json());
app.use('/api/users', user);
app.use(errorHandler);

module.exports = app;