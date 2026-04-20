const express = require('express');
const app = express();
const auth = require('./routes/auth.routes');
const user = require('./routes/user.routes');
const { errorHandler } = require('./middlewares/error-handler.middleware');

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/users', user);
app.use(errorHandler);

module.exports = app;