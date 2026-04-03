const User = require('../models/user.model');
const AppEntityNotFoundError = require('../errors/AppEntityNotFoundError');

/**
 * Inserts the given user to DB.
 * 
 * @param {MongooseDocument} user         the user to be inserted
 * @returns                               the inserted user (as a Mongoose document)
 * @throws {ValidationError}              if user's values are not valid
 * @throws {AppEntitytAlreadyExistsError} if user's username (unique field) already exists in DB
 */
exports.insertUser = async (user) => {
  return await user.save();
}

/**
 * Updates the user with the given ID.
 * 
 * @param {string} userId           the ID of the user to update
 * @param {object} updates          the updated values
 * @returns                         the updated user (as a Mongoose document)
 * @throws {ValidationError}        if the given ID is not a valid ObjectId
 *                                  or if the updated values are not valid
 * @throws {AppEntityNotFoundError} if there isn't a user with the given ID in DB
 * 
 */
exports.updateUser = async (userId, updates) => {
  // Generate user to update
  const user = await User.findById(userId);

  // Check if the document is null - this means that there isn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }

  // Update the values
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;  // ignore the fields that weren't included in the request body
    user[key] = value;
  }

  // Save the changes
  return await user.save();
}

/**
 * Deletes the user with the given ID from DB.
 * 
 * @param {string} userId           the ID of the user to delete
 * @returns                         the deleted user (as a Mongoose document)
 * @throws {ValidationError}        if the given ID is not a valid ObjectId
 * @throws {AppEntityNotFoundError} if there isn't a user with the given ID in DB
 */
exports.deleteUser = async (userId) => {
  // Generate and delete user
  const user = await User.findByIdAndDelete(userId);

  // Check if the document is null - this means that there wasn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }
  return user;
}

/**
 * Returns the user with the given ID.
 * 
 * @param {string} userId           the ID of the user to get
 * @returns                         the user (as a Mongoose document)
 * @throws {ValidationError}        if the given ID is not a valid ObjectId
 * @throws {AppEntityNotFoundError} if there isn't a user with the given ID in DB
 */
exports.getUserById = async (userId) => {
  // Generate user
  const user = await User.findById(userId);

  // Check if the document is null - this means that there isn't a user with the given ID in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'id=${userId}' not found.`);
  }
  return user;
}

/**
 * Returns the user with the given username.
 * 
 * @param {string} username         the username of the user to get
 * @returns                         the user (as a Mongoose document)
 * @throws {AppEntityNotFoundError} if there isn't a user with the given username in DB
 */
exports.getUserByUsername = async (username) => {
  // Generate user
  const user = await User.findOne({username: username});

  // Check if the document is null - this means that there isn't a user with the given username in DB
  if (!user) {
    throw new AppEntityNotFoundError(`User with 'username=${username}' not found.`);
  }
  return user;
}

/**
 * Returns an object that contains information about the pagination and
 * an array with the users that match the filter, sorted and paginated.
 * 
 * @param {object} filter     the query filter object
 * @param {object} sorting    the query sorting object
 * @param {object} pagination the query pagination object
 * @returns                   an object that contains information about
 *                            the pagination and an array of the users
 *                            (as plain JS objects) that match the filter,
 *                            sorted and paginated
 * @throws {ValidationError}  if casting the filter fails
 */
exports.getUsersFilteredSortedPaginated = async (filter, sorting, pagination) => {
  const documents = await User.find(filter)
                              .select({ password: 0 })  // excludes field `password` from the results - used because `toJSON()` is not called as `lean()` returns POJOs
                              .sort(sorting)
                              .skip((pagination.pageNumber - 1) * pagination.pageSize)  // skips documents from previous pages
                              .limit(pagination.pageSize)     // sets the max number of documents returned
                              .lean();                        // returns POJOs (not Mongoose documents)
  const totalDocuments = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalDocuments / pagination.pageSize);
  const currentPageSize = documents.length;

  return {totalDocuments, totalPages, pageSize: pagination.pageSize, currentPage: pagination.pageNumber, currentPageSize, documents};
}

/**
 * Extracts from the request query object:
 * 
 * 1. The filter fields - if they exist, in order to build the query filter
 * object.
 * Multiple filter fields can be specified in the query string, thus
 * resulting in a filter with compound conditions.
 * With the exception of comparison fields, which can appear only once
 * in the query string, all other filter fields can appear multiple times.
 * 
 * 2. The pagination fields - if they exist, validates their values and
 * builds the query pagination object containing these values if present
 * and valid, or default values otherwise.
 * Each pagination field may appear only once in the query string.
 * Multiple appearances is considered invalid input and the default value
 * is applied for this field.
 * 
 * 3. The sorting settings - if they exist, in order to build the query
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
 * Returns an object containing the query filter object, the query sorting
 * object and the query pagination object.
 * 
 * @param {object} queryObj   the request query object
 * @returns                   an object containing the query filter object,
 *                            the query sorting object and the query pagination
 *                            object
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
   * Add the field `_id` (which is unique amongst documents) to achieve
   * a consistent sort for documents containing duplicate values, across
   * multiple executions of the same query (necessary for pagination).
   * It is the last in order, so it does not interfere with the order
   * specified in the query string.
   * This also serves as setting a default if no sorting settings are
   * provided.
   */
  if (!isIdExists(sorting)) {
    sorting['_id'] = 1;
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
   * For the Date fields `createdAt` and `updatedAt` users can specify
   * the comparison operators `gte`, `gt`, `lte`, `lt`, e.g. `createdAt_gte`.
   */
  const comparisonOperators = ['gte', 'gt', 'lte', 'lt'];
  const createdAtComparisonFields = comparisonOperators.map(el => `createdAt_${el}`);
  const updatedAtComparisonFields = comparisonOperators.map(el => `updatedAt_${el}`);
  const filterFields = ['_id', 'username', 'firstname', 'lastname', 'roles', 'isActive', 'createdAt', 'updatedAt',
                        ...createdAtComparisonFields, ...updatedAtComparisonFields];
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
  const sortingFields = ['_id', 'username', 'firstname', 'lastname', 'createdAt', 'updatedAt'];
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
 * @param {object} filter       the query filter object
 * @param {string} key          the filter field
 * @param {string|Array} value  the input value
 */
function buildFilter(filter, key, value) {
  const exactMatchFields = ['_id', 'isActive', 'createdAt', 'updatedAt'];  // fields for which we want exact match

  if (key.match(/_(gte|gt|lte|lt)$/)) {
    if (Array.isArray(value)) return;   // field appears multiple times in the query string (it is considered invalid)
    
    let [ field, operator ] = key.split('_');     // comparison fields have the format `field_operator`
    if (!Object.keys(filter).includes(field)) {   // the first time that the field appears
      filter[field] = {};                         // create an empty object for that field
    }
    filter[field][`$${operator}`] = value;        // add property to the object
  } else if (exactMatchFields.includes(key)) {
    filter[key] = transformExactMatch(value);
  } else {
    filter[key] = transformRegExp(value);
  }
}

/**
 * Transforms the input value to return results with exact match.
 * Input value can either be a string or an Array (if the field
 * appears multiple times in the query string).
 * When an Array, operator `$in` is used, thus the results
 * contain documents which match at least one of the input values.
 * 
 * @param {string|Array} value   the input value
 * @returns                      the tranformed value
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
 * @param {string|Array} value   the input value
 * @returns                      the transformed value
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
 * @param {object} pagination   the query pagination object
 * @param {string} key          the pagination field
 * @param {string|Array} value  the input value
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
 * @param {object} sorting      the query sorting object
 * @param {string} field        the sorting field
 * @param {string|Array} value  the input value
 */
function buildSorting(sorting, field, value) {
  if (Array.isArray(value)) return;   // field appears multiple times in the query string (it is considered invalid)
  
  let sortDir = Number(value);
  if (sortDir !== -1 && sortDir !== 1) return;
  sorting[field] = sortDir;
}

/**
 * Checks if the sorting object contains the field `_id`.
 * 
 * @param {object} sorting    the query sorting object
 * @returns                   true if the sorting object contains
 *                            the field `_id`, false otherwise
 */
function isIdExists(sorting) {
  return Object.keys(sorting).includes('_id');
}