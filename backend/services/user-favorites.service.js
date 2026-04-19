const mongoose = require('mongoose');
const User = require('../models/user.model');
const AppEntityNotFoundError = require('../errors/AppEntityNotFoundError');
const AppEntityAlreadyExistsError = require('../errors/AppEntityAlreadyExistsError');
const ValidationError = require('../errors/ValidationError');

/**
 * Inserts the given movie to the `Favorites` list of the user with the given ID.
 * 
 * @param {string} userId                the ID of the user to whose `Favorites` list 
 *                                       the movie will be inserted
 * @param {object} favorite              the movie to be inserted
 * @returns                              the user after the movie is inserted 
 *                                       (as a Mongoose document)
 * @throws {ValidationError}             if casting fails or if the movie's values 
 *                                       are not valid
 * @throws {AppEntityNotFoundError}      if there isn't a user with the given ID in DB
 * @throws {AppEntityAlreadyExistsError} if the movie already exists in user's `Favorites`
 */
exports.insertFavorite = async (userId, favorite) => {
  // Generate user
  const user = await User.findById(userId);

  // Check if the document is null - this means that there isn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }

  // Check if the movie already exists in user's `Favorites`
  if (await User.exists({ _id: userId, 'favorites.imdbId': favorite.imdbId })) {
    throw new AppEntityAlreadyExistsError('Movie already exists.');
  }

  // Add the movie 
  user.favorites.push(favorite);
  
  // Save the changes
  return await user.save();
}

/**
 * Deletes the movie with the given ID from the `Favorites` list of the user with the given ID.
 * 
 * @param {string} userId           the ID of the user from whose `Favorites` list
 *                                  the movie will be deleted
 * @param {string} favoriteId       the ID of the movie to delete
 * @returns                         the user after the movie is deleted
 *                                  (as a Mongoose document)
 * @throws {ValidationError}        if either of the given IDs is not a valid ObjectId
 * @throws {AppEntityNotFoundError} if there isn't a user with the given ID in DB or
 *                                  if there isn't a movie with the given ID in user's `Favorites`
 */
exports.deleteFavorite = async (userId, favoriteId) => {
  // Generate user
  const user = await User.findById(userId);

  // Check if the document is null - this means that there isn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }

  // Check if the movie exists in user's `Favorites`
  if (!await User.exists({ _id: userId, 'favorites._id': favoriteId })) {
    throw new AppEntityNotFoundError(`Movie with 'id=${favoriteId}' not found.`);
  }

  // Remove the movie 
  user.favorites.pull(favoriteId);
  
  // Save the changes
  return await user.save();
}

/**
 * Returns the movie with the given ID from the `Favorites` list of the user 
 * with the given ID.
 * 
 * @param {string} userId           the ID of the user from whose `Favorites` list
 *                                  the movie will be generated
 * @param {string} favoriteId       the ID of the movie to get
 * @returns                         the movie
 * @throws {ValidationError}        if the given user ID is not a valid ObjectId
 * @throws {AppEntityNotFoundError} if there isn't a user with the given ID in DB or
 *                                  if there isn't a movie with the given ID in user's `Favorites`
 */
exports.getFavorite = async (userId, favoriteId) => {
  // Generate user
  const user = await User.findById(userId);

  // Check if the document is null - this means that there isn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }

  // Generate favorite
  const favorite = user.favorites.id(favoriteId);

  // Check if the document is null - this means that there isn't a movie with the given ID in user's `Favorites`
  if (!favorite) {
    throw new AppEntityNotFoundError(`Movie with 'id=${favoriteId}' not found.`);
  }

  return favorite;
}

/**
 * Returns an object that contains information about the pagination and
 * an array with the favorites that match the filter, sorted and paginated.
 * 
 * @param {string} userId           the ID of the user whose favorites will be 
 *                                  generated
 * @param {object} filter           the aggregation filter object
 * @param {object} sorting          the aggregation sorting object
 * @param {object} pagination       the aggregation pagination object
 * @returns                         an object that contains information about
 *                                  the pagination and an array with the favorites
 *                                  that match the filter, sorted and paginated
 * @throws {ValidationError}        if the given user ID is not a valid ObjectId
 * @throws {AppEntityNotFoundError} if there isn't a user with the given ID in DB
 */
exports.getFavoritesFilteredSortedPaginated = async (userId, filter, sorting, pagination) => {
  // Generate user
  const user = await User.findById(userId);

  // Check if the document is null - this means that there isn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }

  const totalDocumentsPipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },       // cast manually to an ObjectId
    { $unwind: '$favorites' },
    { $match: filter }
  ];
  const documentsPipeline = [...totalDocumentsPipeline,
    { $project: { _id: 0, favorites: 1 } },
    { $sort: sorting },
    { $skip: (pagination.pageNumber - 1) * pagination.pageSize },   // skips documents from previous pages
    { $limit: pagination.pageSize }                                 // sets the max number of documents returned
  ];
  const documents = await User.aggregate(documentsPipeline);
  const totalDocuments = (await User.aggregate(totalDocumentsPipeline)).length;
  const totalPages = Math.ceil(totalDocuments / pagination.pageSize);
  const currentPageSize = documents.length;

  return {totalDocuments, totalPages, pageSize: pagination.pageSize, currentPage: pagination.pageNumber, currentPageSize, documents: documents.map(el => el.favorites)};
}

/**
 * Extracts from the request query object:
 * 
 * 1. The filter fields - if they exist, in order to build the aggregation
 * filter object.
 * Multiple filter fields can be specified in the query string, thus
 * resulting in a filter with compound conditions.
 * With the exception of comparison fields, which can appear only once
 * in the query string, all other filter fields can appear multiple times.
 * 
 * 2. The pagination fields - if they exist, validates their values and
 * builds the aggregation pagination object containing these values if 
 * present and valid, or default values otherwise.
 * Each pagination field may appear only once in the query string.
 * Multiple appearances is considered invalid input and the default value
 * is applied for this field.
 * 
 * 3. The sorting settings - if they exist, in order to build the aggregation
 * sorting object. A valid input for a sorting setting has the format:
 *    sortBy_field=sortDir
 * where:
 *    `field` is the field to sort by, and
 *    `sortDir` defines the sort direction
 * Multiple sorting fields can be specified in the query string, and if so,
 * their order in the query string determines what key MongoDB server sorts by
 * first.
 * Each sorting field may appear only once in the query string to be considered
 * valid. In case of multiple appearances, the sorting field is not applied.
 * 
 * Returns an object containing the aggregation filter object, the aggregation
 * sorting object and the aggregation pagination object.
 * 
 * @param {object} queryObj   the request query object
 * @returns                   an object containing the aggregation filter object,
 *                            the aggregation sorting object and the aggregation 
 *                            pagination object
 */
exports.generateSettings = (queryObj) => {
  const filter = {};
  const sorting = {};
  const pagination = {  // set default values if no input or invalid input
    pageSize: 10,
    pageNumber: 1
  };

  for (const [key, value] of Object.entries(queryObj)) {
    // if key is a filter field
    if (isFilterField(key)) {
      buildFilter(filter, key, value);
      continue;
    }

    // if key is a pagination field
    if (isPaginationField(key)) {
      buildPagination(pagination, key, value);
      continue;
    }

    // if key is a sorting field
    if (key.match(/^sortBy_/)) {
      let field = generateSortingField(key);
      if (field && isSortingField(field)) {
        buildSorting(sorting, field, value);
      }
    }
  }

  /*
   * Add the field `_id` (which is unique amongst favorites) to achieve
   * a consistent sort for favorites containing duplicate values, across
   * multiple executions of the same aggregation (necessary for pagination).
   * It is the last in order, so it does not interfere with the order
   * specified in the query string.
   * This also serves as setting a default if no sorting settings are
   * provided.
   */
  if (!isIdExists(sorting)) {
    sorting['favorites._id'] = 1;
  }

  return {filter, sorting, pagination};
}

/**
 * Checks if the input key is a filter field.
 * 
 * @param {string} key  the key to check
 * @returns             true if the key is a filter field, false otherwise
 */
function isFilterField(key) {
  /* 
   * For the Number fields `year`, `runtime` and `imdbRating`, and the Date field `createdAt`
   * users can specify the comparison operators `gte`, `gt`, `lte`, `lt`, e.g. `createdAt_gte`.
   */
  const comparisonOperators = ['gte', 'gt', 'lte', 'lt'];
  const yearComparisonFields = comparisonOperators.map(el => `year_${el}`);
  const runtimeComparisonFields = comparisonOperators.map(el => `runtime_${el}`);
  const imdbRatingComparisonFields = comparisonOperators.map(el => `imdbRating_${el}`);
  const createdAtComparisonFields = comparisonOperators.map(el => `createdAt_${el}`);
  const filterFields = ['_id', 'title', 'year', 'runtime', 'genre', 'director', 'writer', 'actors', 
                        'plot', 'language', 'poster', 'imdbRating', 'imdbId', 'createdAt',
                        ...yearComparisonFields, ...runtimeComparisonFields, 
                        ...imdbRatingComparisonFields, ...createdAtComparisonFields,];
  return filterFields.includes(key);
}

/**
 * Checks if the input key is a pagination field.
 * 
 * @param {string} key  the key to check
 * @returns             true if the key is a pagination field, false otherwise
 */
function isPaginationField(key) {
  return key === 'pageSize' || key === 'pageNumber';
}

/**
 * Checks if the field is a sorting field.
 * 
 * @param {string} field  the field to ckeck
 * @returns               true if the field is a sorting field, false otherwise
 */
function isSortingField(field) {
  const sortingFields = ['_id', 'title', 'year', 'runtime', 'imdbRating', 'imdbId', 'createdAt'];
  return sortingFields.includes(field);
}

/**
 * Extracts the sorting field from the input key.
 * 
 * @param {string} key  the input key
 * @returns             the sorting field if it exists, otherwise `undefined`
 */
function generateSortingField(key) {
  let field;
  let tokens = key.split('_');  // valid sorting keys have the format `sortBy_field`
  
  if (tokens.length != 2) return;
  field = tokens[1];
  return (field === 'id') ? '_id' : field;  // add `_` to the field `id`
}

/**
 * Tranforms the input value according to the following choices and
 * assigns it to the respective filter field.
 * 
 * 1. Comparison fields
 * 2. Fields for which we want exact match
 * 3. All other fields -> fields for which we want to match the
 * pattern %value% (= not exact match) and ignore case sensitivity
 * 
 * @param {object} filter       the aggregation filter object
 * @param {string} key          the filter field
 * @param {string|Array} value  the input value
 */
function buildFilter(filter, key, value) {
  const exactMatchFields = ['_id', 'year', 'runtime', 'imdbRating', 'imdbId', 'createdAt'];  // fields for which we want exact match

  value = castValue(key, value);        // mongoose doesn't cast aggregation pipelines
  
  if (key.match(/_(gte|gt|lte|lt)$/)) {
    if (Array.isArray(value)) return;   // field appears multiple times in the query string (it is considered invalid)
    
    let [ field, operator ] = key.split('_');     // comparison fields have the format `field_operator`
    field = `favorites.${field}`;
    if (!Object.keys(filter).includes(field)) {   // the first time that the field appears
      filter[field] = {};                         // create an empty object for that field
    }
    filter[field][`$${operator}`] = value;        // add property to the object
  } else if (exactMatchFields.includes(key)) {
    filter[`favorites.${key}`] = transformExactMatch(value);
  } else {
    filter[`favorites.${key}`] = transformRegExp(value);
  }
}

/**
 * Converts the input value to the correct type.
 * 
 * @param {string} key          the filter field
 * @param {string|Array} value  the input value
 * @returns                     the value in the correct type
 */
function castValue(key, value) {
  let castValue = value;

  // ObjectId fields
  if (key === '_id' || key === 'imdbId') {
    if (Array.isArray(value)) {
      castValue = value.map(el => castToObjectId(key, el));
    } else {
      castValue = castToObjectId(key, value);
    } 
  }

  // Number fields
  if (key.match(/^(year|runtime|imdbRating)/)) {
    if (Array.isArray(value)) {
      castValue = value.map(el => castToNumber(key, el));
    } else {
      castValue = castToNumber(key, value); 
    } 
  }

  // Date fields
  if (key.match(/^createdAt/)) {
    if (Array.isArray(value)) {
      castValue = value.map(el => castToDate(key, el));
    } else {
      castValue = castToDate(key, value); 
    } 
  }

  return castValue;
}

/**
 * Converts the input value to an ObjectId.
 * 
 * @param {string} key        the filter field
 * @param {string} value      the input value
 * @returns                   the value as an ObjectId
 * @throws {ValidationError}  if the input value is not a 
 *                            valid ObjectId
 */
function castToObjectId(key, value) {
  if (!mongoose.isObjectIdOrHexString(value)) {
    const errors = {
      [key]: {
        message: `Cast error: "${key}" must be an ObjectId`
      }
    };
    throw new ValidationError(errors);
  }

  return new mongoose.Types.ObjectId(value);
}

/**
 * Converts the input value to a number.
 * 
 * @param {string} key        the filter field
 * @param {string} value      the input value
 * @returns                   the value as a number
 * @throws {ValidationError}  if the input value is not a 
 *                            valid number
 */
function castToNumber(key, value) {
  const castValue = Number(value);

  if (!castValue) {
    const errors = {
      [key]: {
        message: `Cast error: "${key}" must be a number`
      }
    };
    throw new ValidationError(errors);
  }
  return castValue;
}

/**
 * Converts the input value to a date.
 * 
 * @param {string} key        the filter field
 * @param {string} value      the input value
 * @returns                   the value as a date
 * @throws {ValidationError}  if the input value is not a 
 *                            valid date
 */
function castToDate(key, value) {
  const castValue = new Date(value);

  if (castValue.toString() === 'Invalid Date') {
    const errors = {
      [key]: {
        message: `Cast error: "${key}" must be a date`
      }
    };
    throw new ValidationError(errors);
  }
  return castValue;
}

/**
 * Transforms the input value to return results with exact match.
 * Input value can either be a string or an Array (if the field
 * appears multiple times in the query string).
 * When an Array, operator `$in` is used, thus the results
 * contain documents which match at least one of the input values.
 * 
 * @param {string|Array} value  the input value
 * @returns                     the transformed value
 */
function transformExactMatch(value) {
  if (Array.isArray(value)) {
    value = { $in: value };
  }
  return value;
}

/**
 * Transforms the input value to return results that match the
 * pattern %value% (= not exact match) and ignore case sensitivity.
 * Input value can either be a string or an Array (if the field
 * appears multiple times in the query string).
 * When an Array, operator `$in` is used, thus the results
 * contain documents which match at least one of the input values.
 * 
 * @param {string|Array} value  the input value
 * @returns                     the transformed value
 */
function transformRegExp(value) {
  if (Array.isArray(value)) {
    value = value.join('|');
  }
  return new RegExp(value, 'i');
}

/**
 * Validates the input value and if it is valid, assigns it to the
 * respective pagination field.
 * Valid values are integers > 0.
 * 
 * @param {object} pagination   the aggregation pagination object
 * @param {string} key          the pagination field
 * @param {string|Array} value  the input value
 * @returns                     the control back to the caller if the
 *                              input value is an array (indicates multiple 
 *                              appearances of the pagination field)
 */
function buildPagination(pagination, key, value) {
  if (Array.isArray(value)) return;   // field appears multiple times in the query string (it is considered invalid)

  let inputValue = Number(value);
  if (inputValue && Number.isInteger(inputValue) && inputValue > 0) {
    pagination[key] = inputValue;
  }
}

/**
 * Validates the input value which corresponds to the sort direction,
 * and if it is valid, assigns it to the respective sorting field.
 * Valid values are `1` for ASC and `-1` for DESC.
 * 
 * @param {object} sorting      the aggregation sorting object
 * @param {string} field        the sorting field
 * @param {string|Array} value  the input value
 * @returns                     the control back to the caller if the
 *                              input value is an array (indicates multiple 
 *                              appearances of the sorting field) or if it
 *                              is invalid
 */
function buildSorting(sorting, field, value) {
  if (Array.isArray(value)) return;   // field appears multiple times in the query string (it is considered invalid)
  
  let sortDir = Number(value);
  if (sortDir !== -1 && sortDir !== 1) return;
  sorting[`favorites.${field}`] = sortDir;
}

/**
 * Checks if the sorting object contains the field `favorites._id`.
 * 
 * @param {object} sorting  the query sorting object
 * @returns                 true if the sorting object contains
 *                          the field `favorites._id`, false otherwise
 */
function isIdExists(sorting) {
  return Object.keys(sorting).includes('favorites._id');
}