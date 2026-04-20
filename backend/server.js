const mongoose = require('mongoose');
const app = require('./app');
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
    console.log('Connection to MongoDB established');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  },
  err => console.error('Failed to connect to MongoDB', err)
);