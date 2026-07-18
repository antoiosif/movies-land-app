const schemas = require('./schemas.swagger');
const parameters = require('./parameters.swagger');
const auth = require('./paths-auth.swagger');
const user = require('./paths-user.swagger');
const userFavorites = require('./paths-user-favorites.swagger');

exports.options = {
  "openapi": "3.2.0",
  "info": {
    "title": "Movies Land API",
    "summary": "An app that manages users and their favorite movies.",
    "description": "This API provides the CRUD operations to create, read, update and delete <b>Users</b> from the DB, and also create, read and delete movies from the <b>Favorites</b> list of each user.",
    "contact": {
      "name": "API Support",
      "url": "https://github.com/antoiosif"
    },
    "license": {
      "name": "ISC",
      "url": "https://www.isc.org/"
    },
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local development server",
      "name": "dev"
    }
  ],
  "paths": {
    "/api/auth/register": {
      "post": auth.register
    },
    "/api/auth/login": {
      "post": auth.login
    },
    "/api/users": {
      "get": user.getUsersFilteredSortedPaginated,
      "post": user.insertUser
    },
    "/api/users/{userId}": {
      "get": user.getUser,
      "patch": user.updateUser,
      "delete": user.deleteUser
    },
    "/api/users/{userId}/favorites": {
      "get": userFavorites.getFavoritesFilteredSortedPaginated,
      "post": userFavorites.insertFavorite
    },
    "/api/users/{userId}/favorites/{favoriteId}": {
      "get": userFavorites.getFavorite,
      "delete": userFavorites.deleteFavorite
    }
  },
  "components": {
    "schemas": {
      "User": schemas.user,
      "Movie": schemas.movie,
      "UserInsertData": schemas.userInsertData,
      "UserUpdateData": schemas.userUpdateData,
      "UserSuccess": schemas.userSuccess,
      "UsersFilteredSortedPaginatedSuccess": schemas.usersFilteredSortedPaginatedSuccess,
      "MoviesFilteredSortedPaginatedSuccess": schemas.moviesFilteredSortedPaginatedSuccess,
      "AppGenericError": schemas.appGenericError,
      "ValidationError": schemas.validationError
    },
    "parameters": {
      "userIdParam": parameters.userIdParam,
      "favoriteIdParam": parameters.favoriteIdParam,
      "pageSizeParam": parameters.pageSizeParam,
      "pageNumberParam": parameters.pageNumberParam,
      "filterUserIdParam": parameters.filterUserIdParam,
      "filterUsernameParam": parameters.filterUsernameParam,
      "filterFirstnameParam": parameters.filterFirstnameParam,
      "filterLastnameParam": parameters.filterLastnameParam,
      "filterRolesParam": parameters.filterRolesParam,
      "filterIsActiveParam": parameters.filterIsActiveParam,
      "filterUserCreatedAtParam": parameters.filterUserCreatedAtParam,
      "filterUserCreatedAtGTEParam": parameters.filterUserCreatedAtGTEParam,
      "filterUserCreatedAtGTParam": parameters.filterUserCreatedAtGTParam,
      "filterUserCreatedAtLTEParam": parameters.filterUserCreatedAtLTEParam,
      "filterUserCreatedAtLTParam": parameters.filterUserCreatedAtLTParam,
      "filterUserUpdatedAtParam": parameters.filterUserUpdatedAtParam,
      "filterUserUpdatedAtGTEParam": parameters.filterUserUpdatedAtGTEParam,
      "filterUserUpdatedAtGTParam": parameters.filterUserUpdatedAtGTParam,
      "filterUserUpdatedAtLTEParam": parameters.filterUserUpdatedAtLTEParam,
      "filterUserUpdatedAtLTParam": parameters.filterUserUpdatedAtLTParam,
      "filterFavoriteIdParam": parameters.filterFavoriteIdParam,
      "filterTitleParam": parameters.filterTitleParam,
      "filterYearParam": parameters.filterYearParam,
      "filterYearGTEParam": parameters.filterYearGTEParam,
      "filterYearGTParam": parameters.filterYearGTParam,
      "filterYearLTEParam": parameters.filterYearLTEParam,
      "filterYearLTParam": parameters.filterYearLTParam,
      "filterRuntimeParam": parameters.filterRuntimeParam,
      "filterRuntimeGTEParam": parameters.filterRuntimeGTEParam,
      "filterRuntimeGTParam": parameters.filterRuntimeGTParam,
      "filterRuntimeLTEParam": parameters.filterRuntimeLTEParam,
      "filterRuntimeLTParam": parameters.filterRuntimeLTParam,
      "filterGenreParam": parameters.filterGenreParam,
      "filterDirectorParam": parameters.filterDirectorParam,
      "filterWriterParam": parameters.filterWriterParam,
      "filterActorsParam": parameters.filterActorsParam,
      "filterPlotParam": parameters.filterPlotParam,
      "filterLanguageParam": parameters.filterLanguageParam,
      "filterPosterParam": parameters.filterPosterParam,
      "filterImdbRatingParam": parameters.filterImdbRatingParam,
      "filterImdbRatingGTEParam": parameters.filterImdbRatingGTEParam,
      "filterImdbRatingGTParam": parameters.filterImdbRatingGTParam,
      "filterImdbRatingLTEParam": parameters.filterImdbRatingLTEParam,
      "filterImdbRatingLTParam": parameters.filterImdbRatingLTParam,
      "filterImdbIdParam": parameters.filterImdbIdParam,
      "filterFavoriteCreatedAtParam": parameters.filterFavoriteCreatedAtParam,
      "filterFavoriteCreatedAtGTEParam": parameters.filterFavoriteCreatedAtGTEParam,
      "filterFavoriteCreatedAtGTParam": parameters.filterFavoriteCreatedAtGTParam,
      "filterFavoriteCreatedAtLTEParam": parameters.filterFavoriteCreatedAtLTEParam,
      "filterFavoriteCreatedAtLTParam": parameters.filterFavoriteCreatedAtLTParam,
      "sortByUserIdParam": parameters.sortByUserIdParam,
      "sortByUsernameParam": parameters.sortByUsernameParam,
      "sortByFirstnameParam": parameters.sortByFirstnameParam,
      "sortByLastnameParam": parameters.sortByLastnameParam,
      "sortByUserCreatedAtParam": parameters.sortByUserCreatedAtParam,
      "sortByUserUpdatedAtParam": parameters.sortByUserUpdatedAtParam,
      "sortByFavoriteIdParam": parameters.sortByFavoriteIdParam,
      "sortByTitleParam": parameters.sortByTitleParam,
      "sortByYearParam": parameters.sortByYearParam,
      "sortByRuntimeParam": parameters.sortByRuntimeParam,
      "sortByImdbRatingParam": parameters.sortByImdbRatingParam,
      "sortByImdbIdParam": parameters.sortByImdbIdParam,
      "sortByFavoriteCreatedAtParam": parameters.sortByFavoriteCreatedAtParam
    },
    "responses": {
      "default": {
        "description": "Unexpected error.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/AppGenericError"
            }
          }
        }
      },
      "noToken": {
        "description": "User not authorized. No JWT was provided.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/AppGenericError"
            },
            "example": {
              "status": false,
              "data": {
                "name": "AppNotAuthorizedError",
                "statusCode": 401,
                "message": "Access Denied: no token provided"
              }
            }
          }
        }
      },
      "userUsernameNotFound": {
        "description": "User not found in DB. The provided <b>username</b> doesn't correspond to a user in DB.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/AppGenericError"
            },
            "example": {
              "status": false,
              "data": {
                "name": "AppEntityNotFoundError",
                "statusCode": 404,
                "message": "User with 'notexists@example.com' not found."
              }
            }
          }
        }
      },
      "userIdNotFound": {
        "description": "User not found in DB. The provided <b>ID</b> doesn't correspond to a user in DB.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/AppGenericError"
            },
            "example": {
              "status": false,
              "data": {
                "name": "AppEntityNotFoundError",
                "statusCode": 404,
                "message": "User with 'id=000000000000000000000000' not found."
              }
            }
          }
        }
      },
      "userAlreadyExists": {
        "description": "User already exists in DB. The provided <b>username</b> (which is a unique field) corresponds to a user that already exists in DB.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/AppGenericError"
            },
            "example": {
              "status": false,
              "data": {
                "name": "AppEntityAlreadyExistsError",
                "statusCode": 409,
                "message": "Username already exists."
              }
            }
          }
        }
      },
      "movieAlreadyExists": {
        "description": "Movie already exists in user's <b>Favorites</b> list. The provided <b>imdbId</b> (which is a unique field) corresponds to a movie that already exists in user's <b>Favorites</b> list.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/AppGenericError"
            },
            "example": {
              "status": false,
              "data": {
                "name": "AppEntityAlreadyExistsError",
                "statusCode": 409,
                "message": "Movie already exists."
              }
            }
          }
        }
      }
    },
    "examples": {
      "castingIdError": {
        "summary": "Casting for ID fails",
        "description": "The provided <b>ID</b> can't be cast to the appropriate type (ObjectId).",
        "value": {
          "status": false,
          "data": {
            "name": "ValidationError",
            "statusCode": 400,
            "errors": {
              "_id": 'Cast error: "_id" must be an ObjectId'
            },
            "message": "Validation failed."
          }
        }
      },
      "userNotFound": {
        "summary": "User not found",
        "description": "The provided <b>ID</b> doesn't correspond to a user in DB.",
        "value": {
          "status": false,
          "data": {
            "name": "AppEntityNotFoundError",
            "statusCode": 404,
            "message": "User with 'id=000000000000000000000000' not found."
          }
        }
      },
      "movieNotFound": {
        "summary": "Movie not found",
        "description": "The provided <b>ID</b> doesn't correspond to a movie in user's <b>Favorites</b> list.",
        "value": {
          "status": false,
          "data": {
            "name": "AppEntityNotFoundError",
            "statusCode": 404,
            "message": "Movie with 'id=000000000000000000000000' not found."
          }
        }
      },
      "expiredToken": {
        "summary": "Expired token",
        "description": "The provided token has expired.",
        "value": {
          "status": false,
          "data": {
            "name": "AccessDeniedError",
            "statusCode": 403,
            "message": "Access Denied: jwt expired"
          }
        }
      },
      "invalidSignature": {
        "summary": "Invalid signature",
        "description": "The provided token is not valid.",
        "value": {
          "status": false,
          "data": {
            "name": "AccessDeniedError",
            "statusCode": 403,
            "message": "Access Denied: invalid signature"
          }
        }
      },
      "malformedToken": {
        "summary": "Malformed token",
        "description": "The provided token doesn't have the correct format (three components delimited by a '.').",
        "value": {
          "status": false,
          "data": {
            "name": "AccessDeniedError",
            "statusCode": 403,
            "message": "Access Denied: jwt malformed"
          }
        }
      },
      "noRoles": {
        "summary": "No roles",
        "description": "The provided token doesn't include any roles.",
        "value": {
          "status": false,
          "data": {
            "name": "AccessDeniedError",
            "statusCode": 403,
            "message": "Access Denied: no roles found"
          }
        }
      },
      "insufficientPermissions": {
        "summary": "Insufficient permissions",
        "description": "The provided token does not include the necessary role(s).",
        "value": {
          "status": false,
          "data": {
            "name": "AccessDeniedError",
            "statusCode": 403,
            "message": "Access Denied: insufficient permissions"
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "description": "Bearer token using a JWT.",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "tags": [
    {
      "name": "auth",
      "summary": "Authentication",
      "description": "Endpoints for Authentication",
      "kind":"nav"
    },
    {
      "name": "users",
      "summary": "Users",
      "description": "Endpoints for user management operations",
      "kind":"nav"
    },
    {
      "name": "favorites",
      "summary": "User's favorite movies",
      "description": "Endpoints for user's favorite movies management operations",
      "kind":"nav"
    }
  ]
};