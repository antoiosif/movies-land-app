exports.getFavoritesFilteredSortedPaginated = {
  "tags": ["favorites"],
  "description": "Returns an object that contains information about the pagination and an array with the movies that match the filtering criteria from the <b>Favorites</b> list of the user with the given <b>ID</b>, sorted and paginated.",
  "operationId": "getFavoritesFilteredSortedPaginated",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" },
    { "$ref": "#/components/parameters/pageSizeParam" },
    { "$ref": "#/components/parameters/pageNumberParam" },
    { "$ref": "#/components/parameters/filterFavoriteIdParam" },
    { "$ref": "#/components/parameters/filterTitleParam" },
    { "$ref": "#/components/parameters/filterYearParam" },
    { "$ref": "#/components/parameters/filterYearGTEParam" },
    { "$ref": "#/components/parameters/filterYearGTParam" },
    { "$ref": "#/components/parameters/filterYearLTEParam" },
    { "$ref": "#/components/parameters/filterYearLTParam" },
    { "$ref": "#/components/parameters/filterRuntimeParam" },
    { "$ref": "#/components/parameters/filterRuntimeGTEParam" },
    { "$ref": "#/components/parameters/filterRuntimeGTParam" },
    { "$ref": "#/components/parameters/filterRuntimeLTEParam" },
    { "$ref": "#/components/parameters/filterRuntimeLTParam" },
    { "$ref": "#/components/parameters/filterGenreParam" },
    { "$ref": "#/components/parameters/filterDirectorParam" },
    { "$ref": "#/components/parameters/filterWriterParam" },
    { "$ref": "#/components/parameters/filterActorsParam" },
    { "$ref": "#/components/parameters/filterPlotParam" },
    { "$ref": "#/components/parameters/filterLanguageParam" },
    { "$ref": "#/components/parameters/filterPosterParam" },
    { "$ref": "#/components/parameters/filterImdbRatingParam" },
    { "$ref": "#/components/parameters/filterImdbRatingGTEParam" },
    { "$ref": "#/components/parameters/filterImdbRatingGTParam" },
    { "$ref": "#/components/parameters/filterImdbRatingLTEParam" },
    { "$ref": "#/components/parameters/filterImdbRatingLTParam" },
    { "$ref": "#/components/parameters/filterImdbIdParam" },
    { "$ref": "#/components/parameters/filterFavoriteCreatedAtParam" },
    { "$ref": "#/components/parameters/filterFavoriteCreatedAtGTEParam" },
    { "$ref": "#/components/parameters/filterFavoriteCreatedAtGTParam" },
    { "$ref": "#/components/parameters/filterFavoriteCreatedAtLTEParam" },
    { "$ref": "#/components/parameters/filterFavoriteCreatedAtLTParam" },
    { "$ref": "#/components/parameters/sortByFavoriteIdParam" },
    { "$ref": "#/components/parameters/sortByTitleParam" },
    { "$ref": "#/components/parameters/sortByYearParam" },
    { "$ref": "#/components/parameters/sortByRuntimeParam" },
    { "$ref": "#/components/parameters/sortByImdbRatingParam" },
    { "$ref": "#/components/parameters/sortByImdbIdParam" },
    { "$ref": "#/components/parameters/sortByFavoriteCreatedAtParam" }
  ],
  "responses": {
    "200": {
      "description": "Success. Returns an object that contains information about the pagination and an array with the movies from the user's <b>Favorites</b> list that match the filtering criteria, sorted and paginated.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/MoviesFilteredSortedPaginatedSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "totalDocuments": 1,
              "totalPages": 1,
              "pageSize": 10,
              "currentPage": 1,
              "currentPageSize": 1,
              "documents": [
                {
                  "title": "The Artist",
                  "year": 2011,
                  "runtime": 100,
                  "genre": ["Comedy", "Drama", "Romance"],
                  "director": ["Michel Hazanavicius"],
                  "writer": ["Michel Hazanavicius"],
                  "actors": ["Jean Dujardin", "Bérénice Bejo", "John Goodman"],
                  "plot": "Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.",
                  "language": ["English", "French"],
                  "poster": "https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg",
                  "imdbRating": 7.8,
                  "imdbId": "tt1655442",
                  "_id": "69ce118cabb69d2b865bdda7",
                  "createdAt": "2026-04-02T06:49:48.628Z"
                }
              ]
            }
          }
        }
      }
    },
    "400": {
      "description": "Validation failed. The provided user <b>ID</b> or filter parameters can't be cast to the appropriate types.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ValidationError"
          },
          "examples": {
            "castingIdError": {
              "$ref": "#/components/examples/castingIdError"
            },
            "castingError": {
              "summary": "Casting fails",
              "description": "The provided filter parameters can't be cast to the appropriate types of the <b>Movie</b> schema.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "imdbRating_gte": 'Cast error: "imdbRating_gte" must be a number',
                    "createdAt": `Cast error: "createdAt" must be a date`
                  },
                  "message": "Validation failed."
                }
              }
            }
          }
        }
      }
    },
    "401": {
      "$ref": "#/components/responses/noToken"
    },
    "403": {
      "description": "Access denied. Either the provided JWT is not valid or the user doesn't have the sufficient permissions (only 'ADMIN' and 'EDITOR' can access this route). The returned <b>message</b> varies. Some potential messages are: <ul><li><b>Access Denied: jwt expired</b> - the token has expired</li><li><b>Access Denied: invalid signature</b> - the token is not valid</li><li><b>Access Denied: jwt malformed</b> - the token doesn't have the correct format (three components delimited by a '.')</li><li><b>Access Denied: no roles found</b> - the token doesn't include any roles</li><li><b>Access Denied: insufficient permissions</b> - the user doesn't have the role 'ADMIN' or 'EDITOR'</li></ul>",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "expiredToken": {
              "$ref": "#/components/examples/expiredToken"
            },
            "invalidSignature": {
              "$ref": "#/components/examples/invalidSignature"
            },
            "malformedToken": {
              "$ref": "#/components/examples/malformedToken"
            },
            "noRoles": {
              "$ref": "#/components/examples/noRoles"
            },
            "insufficientPermissions": {
              "$ref": "#/components/examples/insufficientPermissions"
            }
          }
        }
      }
    },
    "404": {
      "$ref": "#/components/responses/userIdNotFound"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.insertFavorite = {
  "tags": ["favorites"],
  "description": "Inserts a movie in the <b>Favorites</b> list of the user with the given <b>ID</b>.",
  "operationId": "insertFavorite",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" }
  ],
  "requestBody": {
    "description": "The data of the movie to be inserted in the <b>Favorites</b> list of the user with the given <b>ID</b>.",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Movie"
        },
        "examples": {
          "success": {
            "summary": "Positive scenario",
            "description": "Provides data to successfully insert a movie in the <b>Favorites</b> list of the user with the given <b>ID</b>.",
            "value": {
              "title": "The Artist",
              "year": 2011,
              "runtime": 100,
              "genre": ["Comedy", "Drama", "Romance"],
              "director": ["Michel Hazanavicius"],
              "writer": ["Michel Hazanavicius"],
              "actors": ["Jean Dujardin", "Bérénice Bejo", "John Goodman"],
              "plot": "Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.",
              "language": ["English", "French"],
              "poster": "https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg",
              "imdbRating": 7.8,
              "imdbId": "tt1655442"
            }
          },
          "castingImdbIdError": {
            "summary": "Negative scenario - Casting imdbId fails",
            "description": "Provides an <b>imdbId</b> that can't be cast to the appropriate type of the <b>Movie</b> schema and a <b>Validation</b> error occurs.",
            "value": {
              "imdbId": ["tt"]
            }
          },
          "castingError": {
            "summary": "Negative scenario - Casting fails",
            "description": "Provides data that can't be cast to the appropriate types of the <b>Movie</b> schema and a <b>Validation</b> error occurs.",
            "value": {
              "title": ["The Artist"],
              "year": [2011],
              "runtime": [100],
              "genre": [["Comedy"], "Drama", "Romance"],
              "director": [["Michel Hazanavicius"]],
              "writer": [["Michel Hazanavicius"]],
              "actors": [["Jean Dujardin"], "Bérénice Bejo", "John Goodman"],
              "plot": ["Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down."],
              "language": [["English"], "French"],
              "poster": ["https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg"],
              "imdbRating": [7.8],
              "imdbId": ["tt165544"]
            }
          },
          "invalidData": {
            "summary": "Negative scenario - Invalid data",
            "description": "Provides data that don't meet the validation requirements and a <b>Validation</b> error occurs.",
            "value": {
              "year": 1887,
              "runtime": 0,
              "imdbRating": -1
            }
          },
          "alreadyExists": {
            "summary": "Negative scenario - Movie to insert already exists",
            "description": "Provides an <b>imdbId</b> (which is a unique field) that corresponds to a movie that already exists in user's <b>Favorites</b> list, and a <b>MovieAlreadyExists</b> error occurs.",
            "value": {
              "title": "The Artist",
              "year": 2011,
              "runtime": 100,
              "genre": ["Comedy", "Drama", "Romance"],
              "director": ["Michel Hazanavicius"],
              "writer": ["Michel Hazanavicius"],
              "actors": ["Jean Dujardin", "Bérénice Bejo", "John Goodman"],
              "plot": "Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.",
              "language": ["English", "French"],
              "poster": "https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg",
              "imdbRating": 7.8,
              "imdbId": "tt1655442"
            }
          }
        }
      }
    }
  },
  "responses": {
    "201": {
      "description": "Movie was inserted succesfully. Returns the user with the given <b>ID</b> with the inserted movie.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "username": "register1@example.com",
              "firstname": "RegisterA",
              "lastname": "UserA",
              "roles": [
                "ADMIN",
                "EDITOR",
                "READER"
              ],
              "isActive": true,
              "favorites": [
                {
                  "title": "The Artist",
                  "year": 2011,
                  "runtime": 100,
                  "genre": ["Comedy", "Drama", "Romance"],
                  "director": ["Michel Hazanavicius"],
                  "writer": ["Michel Hazanavicius"],
                  "actors": ["Jean Dujardin", "Bérénice Bejo", "John Goodman"],
                  "plot": "Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.",
                  "language": ["English", "French"],
                  "poster": "https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg",
                  "imdbRating": 7.8,
                  "imdbId": "tt1655442",
                  "_id": "69ce118cabb69d2b865bdda7",
                  "createdAt": "2026-04-02T06:49:48.628Z"
                }
              ],
              "_id": "69c6bdd3f3a8da186adb36f4",
              "createdAt": "2026-03-10T12:07:25.019Z",
              "updatedAt": "2026-03-10T12:07:25.019Z",
              "__v": 1
            }
          }
        }
      }
    },
    "400": {
      "description": "Validation failed. The provided data don't meet the validation requirements (casting, match certain patterns etc).",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ValidationError"
          },
          "examples": {
            "castingIdError": {
              "$ref": "#/components/examples/castingIdError"
            },
            "castingImdbIdError": {
              "summary": "Casting for imdbId fails",
              "description": "The provided <b>imdbId</b> can't be cast to the appropriate type of the <b>Movie</b> schema.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "favorites.0.imdbId": 'Cast error: "imdbId" must be a string',
                  },
                  "message": "Validation failed."
                }
              }
            },
            "castingError": {
              "summary": "Casting fails",
              "description": "The provided data can't be cast to the appropriate types of the <b>Movie</b> schema.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "favorites.0.title": 'Cast error: "title" must be a string',
                    "favorites.0.year": 'Cast error: "year" must be a Number',
                    "favorites.0.runtime": 'Cast error: "runtime" must be a Number',
                    "favorites.0.genre.0": 'Cast error: "genre.0" must be a [string]',
                    "favorites.0.director.0": 'Cast error: "director.0" must be a [string]',
                    "favorites.0.writer.0": 'Cast error: "writer.0" must be a [string]',
                    "favorites.0.actors.0": 'Cast error: "actors.0" must be a [string]',
                    "favorites.0.plot": 'Cast error: "plot" must be a string',
                    "favorites.0.language.0": 'Cast error: "language.0" must be a [string]',
                    "favorites.0.poster": 'Cast error: "poster" must be a string',
                    "favorites.0.imdbRating": 'Cast error: "imdbRating" must be a Number',
                    "favorites.0.imdbId": 'Cast error: "imdbId" must be a string'
                  },
                  "message": "Validation failed."
                }
              }
            },
            "invalidData": {
              "summary": "Invalid data",
              "description": "The provided data don't meet the validation requirements.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "favorites.0.year": '"year" must be between 1888 and 2100',
                    "favorites.0.runtime": '"runtime" must be > 0',
                    "favorites.0.imdbRating": '"imdbRating" must be between 0 and 10'
                  },
                  "message": "Validation failed."
                }
              }
            }
          }
        }
      }
    },
    "401": {
      "$ref": "#/components/responses/noToken"
    },
    "403": {
      "description": "Access denied. Either the provided JWT is not valid or the user doesn't have the sufficient permissions (only 'ADMIN' and 'EDITOR' can access this route). The returned <b>message</b> varies. Some potential messages are: <ul><li><b>Access Denied: jwt expired</b> - the token has expired</li><li><b>Access Denied: invalid signature</b> - the token is not valid</li><li><b>Access Denied: jwt malformed</b> - the token doesn't have the correct format (three components delimited by a '.')</li><li><b>Access Denied: no roles found</b> - the token doesn't include any roles</li><li><b>Access Denied: insufficient permissions</b> - the user doesn't have the role 'ADMIN' or 'EDITOR'</li></ul>",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "expiredToken": {
              "$ref": "#/components/examples/expiredToken"
            },
            "invalidSignature": {
              "$ref": "#/components/examples/invalidSignature"
            },
            "malformedToken": {
              "$ref": "#/components/examples/malformedToken"
            },
            "noRoles": {
              "$ref": "#/components/examples/noRoles"
            },
            "insufficientPermissions": {
              "$ref": "#/components/examples/insufficientPermissions"
            }
          }
        }
      }
    },
    "404": {
      "$ref": "#/components/responses/userIdNotFound"
    },
    "409": {
      "$ref": "#/components/responses/movieAlreadyExists"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.getFavorite = {
  "tags": ["favorites"],
  "description": "Returns the movie with the given <b>ID</b> from the <b>Favorites</b> list of the user with the given <b>ID</b>.",
  "operationId": "getFavorite",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" },
    { "$ref": "#/components/parameters/favoriteIdParam" }
  ],
  "responses": {
    "200": {
      "description": "Movie was returned succesfully. Returns only the movie (not the whole user).",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/Movie"
          },
          "example": {
            "status": true,
            "data": {
              "title": "The Artist",
              "year": 2011,
              "runtime": 100,
              "genre": ["Comedy", "Drama", "Romance"],
              "director": ["Michel Hazanavicius"],
              "writer": ["Michel Hazanavicius"],
              "actors": ["Jean Dujardin", "Bérénice Bejo", "John Goodman"],
              "plot": "Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.",
              "language": ["English", "French"],
              "poster": "https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg",
              "imdbRating": 7.8,
              "imdbId": "tt1655442",
              "_id": "69ce118cabb69d2b865bdda7",
              "createdAt": "2026-04-02T06:49:48.628Z"
            }
          }
        }
      }
    },
    "400": {
      "description": "Validation failed. The provided <b>ID</b> can't be cast to the appropriate type of the <b>User</b> schema.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ValidationError"
          },
          "examples": {
            "castingIdError": {
              "$ref": "#/components/examples/castingIdError"
            }
          }
        }
      }
    },
    "401": {
      "$ref": "#/components/responses/noToken"
    },
    "403": {
      "description": "Access denied. Either the provided JWT is not valid or the user doesn't have the sufficient permissions (only 'ADMIN' and 'EDITOR' can access this route). The returned <b>message</b> varies. Some potential messages are: <ul><li><b>Access Denied: jwt expired</b> - the token has expired</li><li><b>Access Denied: invalid signature</b> - the token is not valid</li><li><b>Access Denied: jwt malformed</b> - the token doesn't have the correct format (three components delimited by a '.')</li><li><b>Access Denied: no roles found</b> - the token doesn't include any roles</li><li><b>Access Denied: insufficient permissions</b> - the user doesn't have the role 'ADMIN' or 'EDITOR'</li></ul>",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "expiredToken": {
              "$ref": "#/components/examples/expiredToken"
            },
            "invalidSignature": {
              "$ref": "#/components/examples/invalidSignature"
            },
            "malformedToken": {
              "$ref": "#/components/examples/malformedToken"
            },
            "noRoles": {
              "$ref": "#/components/examples/noRoles"
            },
            "insufficientPermissions": {
              "$ref": "#/components/examples/insufficientPermissions"
            }
          }
        }
      }
    },
    "404": {
      "description": "User or Movie not found.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "userNotFound": {
              "$ref": "#/components/examples/userNotFound"
            },
            "movieNotFound": {
              "$ref": "#/components/examples/movieNotFound"
            }
          }
        }
      }
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.deleteFavorite = {
  "tags": ["favorites"],
  "description": "Deletes the movie with the given <b>ID</b> from the <b>Favorites</b> list of the user with the given <b>ID</b>.",
  "operationId": "deleteFavorite",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" },
    { "$ref": "#/components/parameters/favoriteIdParam" }
  ],
  "responses": {
    "200": {
      "description": "Movie was deleted succesfully. Returns the user with the given <b>ID</b> without the movie that was deleted.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "username": "register1@example.com",
              "firstname": "RegisterA",
              "lastname": "UserA",
              "roles": [
                "ADMIN",
                "EDITOR",
                "READER"
              ],
              "isActive": true,
              "favorites": [],
              "_id": "69c6bdd3f3a8da186adb36f4",
              "createdAt": "2026-03-10T12:07:25.019Z",
              "updatedAt": "2026-03-10T12:07:25.019Z",
              "__v": 2
            }
          }
        }
      }
    },
    "400": {
      "description": "Validation failed. The provided <b>ID</b>s can't be cast to the appropriate types.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ValidationError"
          },
          "examples": {
            "castingIdError": {
              "$ref": "#/components/examples/castingIdError"
            }
          }
        }
      }
    },
    "401": {
      "$ref": "#/components/responses/noToken"
    },
    "403": {
      "description": "Access denied. Either the provided JWT is not valid or the user doesn't have the sufficient permissions (only 'ADMIN' and 'EDITOR' can access this route). The returned <b>message</b> varies. Some potential messages are: <ul><li><b>Access Denied: jwt expired</b> - the token has expired</li><li><b>Access Denied: invalid signature</b> - the token is not valid</li><li><b>Access Denied: jwt malformed</b> - the token doesn't have the correct format (three components delimited by a '.')</li><li><b>Access Denied: no roles found</b> - the token doesn't include any roles</li><li><b>Access Denied: insufficient permissions</b> - the user doesn't have the role 'ADMIN' or 'EDITOR'</li></ul>",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "expiredToken": {
              "$ref": "#/components/examples/expiredToken"
            },
            "invalidSignature": {
              "$ref": "#/components/examples/invalidSignature"
            },
            "malformedToken": {
              "$ref": "#/components/examples/malformedToken"
            },
            "noRoles": {
              "$ref": "#/components/examples/noRoles"
            },
            "insufficientPermissions": {
              "$ref": "#/components/examples/insufficientPermissions"
            }
          }
        }
      }
    },
    "404": {
      "description": "User or Movie not found.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "userNotFound": {
              "$ref": "#/components/examples/userNotFound"
            },
            "movieNotFound": {
              "$ref": "#/components/examples/movieNotFound"
            }
          }
        }
      }
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};