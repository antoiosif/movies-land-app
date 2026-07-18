const user = {
  "description": "The User as it is saved in DB.",
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "format": "email",
      "description": "The user's username. It is an email and it is unique amongst users in DB."
    },
    "password": {
      "type": "string",
      "format": "password",
      "pattern": "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&+=])^\S{8,}$",
      "description": "The user's password. It must contain at least 8 characters amongst which<br>- 1 lowercase,<br>- 1 uppercase,<br>- 1 digit,<br>- 1 special character (!@#$%^&+=),<br>and no spaces.<br>User enters plain text and the value is saved encrypted in DB."
    },
    "firstname": {
      "type": "string",
      "pattern": "^[a-zA-Z]{2,}$",
      "description": "The user's firstname. It must contain at least 2 characters (only letters) and no spaces."
    },
    "lastname": {
      "type": "string",
      "pattern": "^[a-zA-Z]{2,}$",
      "description": "The user's lastname. It must contain at least 2 characters (only letters) and no spaces."
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "enum",
        "enum": ["ADMIN", "EDITOR", "READER"]
      },
      "description": "An array containing the roles that a user has, which define his/her permissions.<br>A user with the role <b>ADMIN</b> has access to all operations (create, read, update, delete), whereas a user with the role <b>EDITOR</b> has access to limited operations. Role <b>READER</b> has currently no permissions, but this may change in the future."
    },
    "isActive": {
      "type": "boolean",
      "default": true,
      "description": "This field describes if a user is Active or not (soft delete). By default every new user <b>is Active</b>."
    },
    "favorites": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Movie"
      },
      "description": "An array containing user's favorite movies. By default when inserting a new user in DB the array is <b>empty</b>."
    },
    "_id": {
      "type": "string",
      "readOnly": true,
      "description": "This field is automatically created when a new user is inserted in DB, and its value is unique."
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "readOnly": true,
      "description": "This field is automatically created when a new user is inserted in DB, and its value is the date and time of insertion."
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "readOnly": true,
      "description": "This field is automatically created when a new user is inserted in DB, and its value is the date and time of insertion. It is then automatically updated when changes are made to the user, with the new value corresponding to the date and time of the update."
    },
    "__v": {
      "type": "number",
      "readOnly": true,
      "description": "This field is automatically created when a new user is inserted in DB, and it is automatically updated when changes are made to the user."
    }
  },
  "required": ["username", "password", "firstname", "lastname", "isActive"]
};

const movie = {
  "description": "The Movie as it is saved in user's <b>Favorites</b> list.",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "The movie's title."
    },
    "year": {
      "type": "integer",
      "minimum": 1888,
      "maximum": 2100,
      "description": "The movie's year of release."
    },
    "runtime": {
      "type": "integer",
      "minimum": 1,
      "description": "The movie's runtime (in minutes)."
    },
    "genre": {
      "type": "array",
      "items": {
        "type": "string",
      },
      "description": "An array containing the genres that the movie belongs to."
    },
    "director": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "An array containing the directors of the movie."
    },
    "writer": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "An array containing the writers of the movie."
    },
    "actors": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "An array containing the actors that participate in the movie."
    },
    "plot": {
      "type": "string",
      "description": "The movie's plot."
    },
    "language": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "An array containing the languages that are used in the movie."
    },
    "poster": {
      "type": "string",
      "description": "A url that hosts the movie's poster."
    },
    "imdbRating": {
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "description": "The movie's rating in IMDB."
    },
    "imdbId": {
      "type": "string",
      "description": "The movie's IMDB ID. It can be used to link to the movie's page in IMDB site."
    },
    "_id": {
      "type": "string",
      "readOnly": true,
      "description": "This field is automatically created when a movie is inserted in the <b>Favorites</b> list, and its value is unique."
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "readOnly": true,
      "description": "This field is automatically created when a movie is inserted in the <b>Favorites</b> list, and its value is the date and time of insertion."
    }
  }
};

const userInsertData = {
  "description": "The data of the user to be inserted.",
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "format": "email",
      "description": "The user's username. It is an email and it is unique amongst users in DB."
    },
    "password": {
      "type": "string",
      "format": "password",
      "pattern": "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&+=])^\S{8,}$",
      "description": "The user's password. It must contain at least 8 characters amongst which<br>- 1 lowercase,<br>- 1 uppercase,<br>- 1 digit,<br>- 1 special character (!@#$%^&+=),<br>and no spaces.<br>User enters plain text and the value is saved encrypted in DB."
    },
    "firstname": {
      "type": "string",
      "pattern": "^[a-zA-Z]{2,}$",
      "description": "The user's firstname. It must contain at least 2 characters (only letters) and no spaces."
    },
    "lastname": {
      "type": "string",
      "pattern": "^[a-zA-Z]{2,}$",
      "description": "The user's lastname. It must contain at least 2 characters (only letters) and no spaces."
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "enum",
        "enum": ["ADMIN", "EDITOR", "READER"]
      },
      "description": "An array containing the roles that a user has, which define his/her permissions.<br>A user with the role <b>ADMIN</b> has access to all operations (create, read, update, delete), whereas a user with the role <b>EDITOR</b> has access to limited operations. Role <b>READER</b> has currently no permissions, but this may change in the future."
    }
  },
  "required": ["username", "password", "firstname", "lastname"]
};

const userUpdateData = {
  "description": "The new data of the user to be updated.",
  "type": "object",
  "properties": {
    "firstname": {
      "type": "string",
      "pattern": "^[a-zA-Z]{2,}$",
      "description": "The user's firstname. It must contain at least 2 characters (only letters) and no spaces."
    },
    "lastname": {
      "type": "string",
      "pattern": "^[a-zA-Z]{2,}$",
      "description": "The user's lastname. It must contain at least 2 characters (only letters) and no spaces."
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "enum",
        "enum": ["ADMIN", "EDITOR", "READER"]
      },
      "description": "An array containing the roles that a user has, which define his/her permissions.<br>A user with the role <b>ADMIN</b> has access to all operations (create, read, update, delete), whereas a user with the role <b>EDITOR</b> has access to limited operations. Role <b>READER</b> has currently no permissions, but this may change in the future."
    },
    "isActive": {
      "type": "boolean",
      "default": true,
      "description": "This field describes if a user is Active or not (soft delete). By default every new user <b>is Active</b>."
    }
  }
};

// Responses
const userResponse = structuredClone(user);
delete userResponse.properties.password;  // the response doesn't contain the field `password`
userResponse["description"] = "The returned user. Essentially it is the same as <b>User</b>, with the exception that it doesn't contain the field <b>password</b>, as it is excluded from the response.";

const genericFilteredSortedPaginatedResponse = {
  "type": "object",
  "properties": {
    "totalDocuments": {
      "type": "integer",
      "minimum": 0,
      "description": "The number of all the documents that match the filtering criteria."
    },
    "totalPages": {
      "type": "integer",
      "minimum": 0,
      "description": "The number of the total pages containing the documents that match the filtering criteria."
    },
    "pageSize": {
      "type": "integer",
      "minimum": 1,
      "default": 10,
      "description": "The maximum number of documents a page can have. The last page may have less, depending on the total number of documents."
    },
    "currentPage": {
      "type": "integer",
      "minimum": 1,
      "default": 1,
      "description": "The number of the current page."
    },
    "currentPageSize": {
      "type": "integer",
      "minimum": 0,
      "description": "The number of documents that the current page has."
    },
    "documents": {
      "type": "array",
      "items": {
        "oneOf": [userResponse, movie]
      },
      "description": "An array containing documents that match the filtering criteria, sorted and paginated."
    }
  }
};

const usersFilteredSortedPaginatedResponse = structuredClone(genericFilteredSortedPaginatedResponse);
usersFilteredSortedPaginatedResponse.properties.documents.items = userResponse;
usersFilteredSortedPaginatedResponse["description"] = "Contains information about the pagination and an array with the users that match the filtering criteria, sorted and paginated.";

const moviesFilteredSortedPaginatedResponse = structuredClone(genericFilteredSortedPaginatedResponse);
moviesFilteredSortedPaginatedResponse.properties.documents.items = movie;
moviesFilteredSortedPaginatedResponse["description"] = "Contains information about the pagination and an array with the movies that match the filtering criteria, sorted and paginated.";

// Success
const appGenericSuccess = {
  "type": "object",
  "properties": {
    "status": {
      "type": "boolean",
      "const": true
    },
    "data": {}
  },
  "required": ["status", "data"]
};

const userSuccess = structuredClone(appGenericSuccess);
userSuccess.properties.data = userResponse;

const usersFilteredSortedPaginatedSuccess = structuredClone(appGenericSuccess);
usersFilteredSortedPaginatedSuccess.properties.data = usersFilteredSortedPaginatedResponse;

const moviesFilteredSortedPaginatedSuccess = structuredClone(appGenericSuccess);
moviesFilteredSortedPaginatedSuccess.properties.data = moviesFilteredSortedPaginatedResponse;

// Failure
const appGenericError = {
  "description": "A generic schema of the response if an error occurs.",
  "type": "object",
  "properties": {
    "status": {
      "type": "boolean",
      "const": false
    },
    "data": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "statusCode": {
          "type": "integer",
          "minimum": 400,
          "maximum": 599
        },
        "message": {
          "type": "string"
        }
      },
      "required": ["name", "statusCode", "message"]
    }
  },
  "required": ["status", "data"]
};

const validationError = {
  "description": "Validation error.",
  "type": "object",
  "properties": {
    "status": {
      "type": "boolean",
      "const": false
    },
    "data": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "statusCode": {
          "type": "integer",
          "const": 400
        },
        "errors": {
          "type": "object"
        },
        "message": {
          "type": "string"
        }
      },
      "required": ["name", "statusCode", "errors", "message"]
    }
  },
  "required": ["status", "data"]
};

module.exports = { user, movie, userInsertData, userUpdateData, userSuccess, usersFilteredSortedPaginatedSuccess, moviesFilteredSortedPaginatedSuccess, appGenericError, validationError }