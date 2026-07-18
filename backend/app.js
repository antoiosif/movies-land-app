const express = require('express');
const app = express();
const auth = require('./routes/auth.routes');
const user = require('./routes/user.routes');
const { errorHandler } = require('./middlewares/error-handler.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger');

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/users', user);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument.options)
);
app.use(errorHandler);

module.exports = app;