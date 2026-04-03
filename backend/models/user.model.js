const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const ValidationError = require('../errors/ValidationError');
const AppEntityAlreadyExistsError = require('../errors/AppEntityAlreadyExistsError');

const movieSchema = new mongoose.Schema({
  title: { type: String, index: true },
  year: { type: String, index: true },
  runtime: {
    type: Number,
    min: [0, '"{PATH}" must be >= 0'],
  },
  genre: [String],
  director: [String],
  writer: [String],
  actors: [String],
  plot: { type: String },
  language: [String],
  poster: { type: String },
  imdbRating: {
    type: Number,
    min: [0, '"{PATH}" must be between 0 and 10'],
    max: [10, '"{PATH}" must be between 0 and 10'],
  },
  imdbId: {
    type: String,
    index: {
      sparse: true,
      unique: true
    }
  }
},
{
  timestamps: { createdAt: true, updatedAt: false },  // adds only the 'createdAt' field
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '"{PATH}" is required field'],
    immutable: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '"{PATH}" must be a valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, '"{PATH}" is required field'],
    trim: true,
    match: [/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&+=])^\S{8,}$/, '"{PATH}" must contain at least 8 characters amongst which 1 lowercase, 1 uppercase, 1 digit and 1 special character (!@#$%^&+=), and no spaces']
  },
  firstname: {
    type: String,
    required: [true, '"{PATH}" is required field'],
    trim: true,
    match: [/^[a-zA-Z]{2,}$/, '"{PATH}" must contain at least 2 characters (only letters) and no spaces']
  },
  lastname: {
    type: String,
    required: [true, '"{PATH}" is required field'],
    trim: true,
    match: [/^[a-zA-Z]{2,}$/, '"{PATH}" must contain at least 2 characters (only letters) and no spaces'],
    index: true
  },
  roles: {
    type: [{
      type: String,
      trim: true,
      uppercase: true
    }],
    enum: {
      values: ['ADMIN','EDITOR','READER'],
      message: '"{VALUE}" is not supported value',
    }
  },
  isActive: {
    type: Boolean,
    required: [true, '"{PATH}" is required field'],
    default: true
  },
  favorites: [movieSchema]
},
{
  timestamps: true,             // adds `createdAt` and `updatedAt` fields to `userSchema`
  collation: {
    locale: 'en',
    numericOrdering: true
  },
  strictQuery: true,            // enables strict mode for query filter -> ignores fields that are not specified in `userSchema`
  optimisticConcurrency: true,  // enables optimistic concurrency for all fields -> updates `versionKey` everytime we call `save()` for a document while default versioning would only operate on arrays
});

// Modifies the JSON object in order to exclude the field `password` from the response
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
}

// Middleware that hashes password after validation and before saving document to DB
userSchema.pre('save', async function() {
  const SaltOrRounds = 10;
  this.password = await bcrypt.hash(this.password, SaltOrRounds);
});

// Error Handling middleware
// ValidationError (includes CastError and ValidatorError)
userSchema.post('validate', function(err, doc, next) {
  if (err.name === 'ValidationError') {
    next(new ValidationError(err.errors));
  }
  next();
});

// `code 11000` - a unique field already exists in DB
userSchema.post('save', function(err, doc, next) {
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const errorField = Object.keys(err.keyValue)[0];
    const errorValue = err.keyValue[errorField];
    next(new AppEntityAlreadyExistsError(`'${errorField}=${errorValue}' already exists`));
  }
  next();
});

// CastError - thrown when casting query filter to `userSchema` fails
userSchema.post(/^find/, function(err, doc, next) {
  if (err.name === 'CastError') {
    // Build the object `errors` to have the same format with the one included in ValidationError
    const errors = {
      [err.path]: {
        message: err.message
      }
    };
    next(new ValidationError(errors));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);