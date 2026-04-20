const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./logger/logger');
const port = process.env.PORT || 3000;
const options = {
  dbName: 'moviesdb',
  retryWrites: true,
  writeConcern: {
    w: 'majority'
  }
};

mongoose.connect(process.env.MONGODB_URI, options)
.then(
  () => {
    logger.info('Connection to MongoDB established');
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  },
  err => logger.error('Failed to connect to MongoDB', err)
);