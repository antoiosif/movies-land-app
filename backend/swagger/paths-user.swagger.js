exports.getUsersFilteredSortedPaginated = {
  "tags": ["users"],
  "description": "Returns an object that contains information about the pagination and an array with the users that match the filtering criteria, sorted and paginated.",
  "operationId": "getUsersFilteredSortedPaginated",
  "parameters": [
    { "$ref": "#/components/parameters/pageSizeParam" },
    { "$ref": "#/components/parameters/pageNumberParam" },
    { "$ref": "#/components/parameters/filterUserIdParam" },
    { "$ref": "#/components/parameters/filterUsernameParam" },
    { "$ref": "#/components/parameters/filterFirstnameParam" },
    { "$ref": "#/components/parameters/filterLastnameParam" },
    { "$ref": "#/components/parameters/filterRolesParam" },
    { "$ref": "#/components/parameters/filterIsActiveParam" },
    { "$ref": "#/components/parameters/filterUserCreatedAtParam" },
    { "$ref": "#/components/parameters/filterUserCreatedAtGTEParam" },
    { "$ref": "#/components/parameters/filterUserCreatedAtGTParam" },
    { "$ref": "#/components/parameters/filterUserCreatedAtLTEParam" },
    { "$ref": "#/components/parameters/filterUserCreatedAtLTParam" },
    { "$ref": "#/components/parameters/filterUserUpdatedAtParam" },
    { "$ref": "#/components/parameters/filterUserUpdatedAtGTEParam" },
    { "$ref": "#/components/parameters/filterUserUpdatedAtGTParam" },
    { "$ref": "#/components/parameters/filterUserUpdatedAtLTEParam" },
    { "$ref": "#/components/parameters/filterUserUpdatedAtLTParam" },
    { "$ref": "#/components/parameters/sortByUserIdParam" },
    { "$ref": "#/components/parameters/sortByUsernameParam" },
    { "$ref": "#/components/parameters/sortByFirstnameParam" },
    { "$ref": "#/components/parameters/sortByLastnameParam" },
    { "$ref": "#/components/parameters/sortByUserCreatedAtParam" },
    { "$ref": "#/components/parameters/sortByUserUpdatedAtParam" }
  ],
  "responses": {
    "200": {
      "description": "Success. Returns an object that contains information about the pagination and an array with the users that match the filtering criteria, sorted and paginated.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UsersFilteredSortedPaginatedSuccess"
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
                  "username": "hercule@example.com",
                  "firstname": "Hercule",
                  "lastname": "Poirot",
                  "roles": [
                    "EDITOR",
                    "READER"
                  ],
                  "isActive": true,
                  "favorites": [],
                  "_id": "69c954c9933af76bfe105deb",
                  "createdAt": "2026-03-10T12:07:25.019Z",
                  "updatedAt": "2026-03-10T12:07:25.019Z",
                  "__v": 1
                }
              ]
            }
          }
        }
      }
    },
    "400": {
      "description": "Validation failed. The provided filter parameters can't be cast to the appropriate types of the <b>User</b> schema.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ValidationError"
          },
          "example": {
            "status": false,
            "data": {
              "name": "ValidationError",
              "statusCode": 400,
              "errors": {
                "_id": 'Cast error: "_id" must be an ObjectId',
                "isActive": 'Cast error: "isActive" must be a Boolean',
                "createdAt": 'Cast error: "createdAt" must be a date'
              },
              "message": "Validation failed."
            }
          }
        }
      }
    },
    "401": {
      "$ref": "#/components/responses/noToken"
    },
    "403": {
      "description": "Access denied. Either the provided JWT is not valid or the user doesn't have the sufficient permissions (only 'ADMIN' can access this route). The returned <b>message</b> varies. Some potential messages are: <ul><li><b>Access Denied: jwt expired</b> - the token has expired</li><li><b>Access Denied: invalid signature</b> - the token is not valid</li><li><b>Access Denied: jwt malformed</b> - the token doesn't have the correct format (three components delimited by a '.')</li><li><b>Access Denied: no roles found</b> - the token doesn't include any roles</li><li><b>Access Denied: insufficient permissions</b> - the user doesn't have the role 'ADMIN'</li></ul>",
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
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.insertUser = {
  "tags": ["users"],
  "description": "Inserts a new user.",
  "operationId": "insertUser",
  "requestBody": {
    "description": "The data of the user to be inserted.",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/UserInsertData"
        },
        "examples": {
          "allFields": {
            "summary": "Positive scenario - Data for all fields",
            "description": "Provides data for all fields, to successfully insert a user.",
            "value": {
              "username": "test1@example.com",
              "password": "test1P@ss",
              "firstname": "TestA",
              "lastname": "UserA",
              "roles": ["ADMIN", "EDITOR", "READER"]
            }
          },
          "requiredFields": {
            "summary": "Positive scenario - Data only for required fields",
            "description": "Provides data only for the required fields, to successfully insert a user.",
            "value": {
              "username": "test2@example.com",
              "password": "test2P@ss",
              "firstname": "TestB",
              "lastname": "UserB"
            }
          },
          "castingError": {
            "summary": "Negative scenario - Casting fails",
            "description": "Provides data that can't be cast to the appropriate types of the <b>User</b> schema and a <b>Validation</b> error occurs.",
            "value": {
              "username": ["test1@example.com"],
              "password": ["test1P@ss"],
              "firstname": ["TestA"],
              "lastname": ["UserA"],
              "roles": [["ADMIN"], "EDITOR", "READER"]
            }
          },
          "noData": {
            "summary": "Negative scenario - No data for required fields",
            "description": "Provides no data for the required fields and a <b>Validation</b> error occurs.",
            "value": {
              "roles": ["ADMIN", "EDITOR", "READER"]
            }
          },
          "invalidData": {
            "summary": "Negative scenario - Invalid data",
            "description": "Provides data that don't meet the validation requirements and a <b>Validation</b> error occurs.",
            "value": {
              "username": "test1example.com",
              "password": "test1Pass",
              "firstname": "Test1",
              "lastname": "User A",
              "roles": ["n/a"]
            }
          },
          "userAlreadyExists": {
            "summary": "Negative scenario - User to insert already exists in DB",
            "description": "Provides a <b>username</b> (which is a unique field) that corresponds to a user that already exists in DB, and a <b>UserAlreadyExists</b> error occurs.",
            "value": {
              "username": "sherlock@example.com",
              "password": "P@ss12345",
              "firstname": "Sherlock",
              "lastname": "Holmes",
              "roles": ["ADMIN", "EDITOR", "READER"]
            }
          }
        }
      }
    }
  },
  "responses": {
    "201": {
      "description": "User was inserted succesfully. Returns the inserted user.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "username": "test1@example.com",
              "firstname": "TestA",
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
              "__v": 0
            }
          }
        }
      }
    },
    "400": {
      "description": "Validation failed. The provided data don't meet the validation requirements (casting, data for required fields, match certain patterns etc).",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ValidationError"
          },
          "examples": {
            "castingError": {
              "summary": "Casting fails",
              "description": "The provided data can't be cast to the appropriate types of the <b>User</b> schema.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "username": 'Cast error: "username" must be a string',
                    "password": 'Cast error: "password" must be a string',
                    "firstname": 'Cast error: "firstname" must be a string',
                    "lastname": 'Cast error: "lastname" must be a string',
                    "roles.0": 'Cast error: "roles.0" must be a [string]'
                  },
                  "message": "Validation failed."
                }
              }
            },
            "noData": {
              "summary": "No data for required fields",
              "description": "No data were provided for the required fields.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "username": '"username" is required field',
                    "password": '"password" is required field',
                    "firstname": '"firstname" is required field',
                    "lastname": '"lastname" is required field'
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
                    "username": '"username" must be a valid email',
                    "password": '"password" must contain at least 8 characters amongst which 1 lowercase, 1 uppercase, 1 digit and 1 special character (!@#$%^&+=), and no spaces',
                    "firstname": '"firstname" must contain at least 2 characters (only letters) and no spaces',
                    "lastname": '"lastname" must contain at least 2 characters (only letters) and no spaces',
                    "roles.0": '"N/A" is not supported value'
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
      "description": "Access denied. Either the provided JWT is not valid or the user doesn't have the sufficient permissions (only 'ADMIN' can access this route). The returned <b>message</b> varies. Some potential messages are: <ul><li><b>Access Denied: jwt expired</b> - the token has expired</li><li><b>Access Denied: invalid signature</b> - the token is not valid</li><li><b>Access Denied: jwt malformed</b> - the token doesn't have the correct format (three components delimited by a '.')</li><li><b>Access Denied: no roles found</b> - the token doesn't include any roles</li><li><b>Access Denied: insufficient permissions</b> - the user doesn't have the role 'ADMIN'</li></ul>",
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
    "409": {
      "$ref": "#/components/responses/userAlreadyExists"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.getUser = {
  "tags": ["users"],
  "description": "Returns the user with the given <b>ID</b>.",
  "operationId": "getUser",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" }
  ],
  "responses": {
    "200": {
      "description": "User was returned succesfully.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "username": "test1@example.com",
              "firstname": "TestA",
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
              "__v": 0
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
      "$ref": "#/components/responses/userIdNotFound"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.updateUser = {
  "tags": ["users"],
  "description": "Updates the user with the given <b>ID</b>.",
  "operationId": "updateUser",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" }
  ],
  "requestBody": {
    "description": "The new data of the user to be updated.",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/UserUpdateData"
        },
        "examples": {
          "allFields": {
            "summary": "Positive scenario - Data for all fields",
            "description": "Provides data for all the fields that can be updated, to successfully update the user with the given <b>ID</b>.",
            "value": {
              "firstname": "TESTA",
              "lastname": "USERA",
              "roles": ["ADMIN"],
              "isActive": true
            }
          },
          "oneField": {
            "summary": "Positive scenario - Data only for one field",
            "description": "Provides data only for one field of those that can be updated, to successfully update the user with the given <b>ID</b>.",
            "value": {
              "lastname": "UserA"
            }
          },
          "castingError": {
            "summary": "Negative scenario - Casting fails",
            "description": "Provides data that can't be cast to the appropriate types of the <b>User</b> schema and a <b>Validation</b> error occurs.",
            "value": {
              "firstname": ["TESTA"],
              "lastname": ["USERA"],
              "roles": [["ADMIN"]],
              "isActive": "FALSE"
            }
          },
          "emptyData": {
            "summary": "Negative scenario - Empty data for required fields",
            "description": "Provides empty data for the required fields and a <b>Validation</b> error occurs.",
            "value": {
              "firstname": "",
              "lastname": "",
              "isActive": null
            }
          },
          "invalidData": {
            "summary": "Negative scenario - Invalid data",
            "description": "Provides data that don't meet the validation requirements and a <b>Validation</b> error occurs.",
            "value": {
              "firstname": "Test1",
              "lastname": "User A",
              "roles": ["n/a"]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "User was updated succesfully. Returns the updated user.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "username": "test1@example.com",
              "firstname": "TESTA",
              "lastname": "USERA",
              "roles": [
                "ADMIN"
              ],
              "isActive": true,
              "favorites": [],
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
      "description": "Validation failed. The provided data don't meet the validation requirements (casting, data for required fields, match certain patterns etc).",
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
              "description": "The provided data can't be cast to the appropriate types of the <b>User</b> schema.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "firstname": 'Cast error: "firstname" must be a string',
                    "lastname": 'Cast error: "lastname" must be a string',
                    "roles.0": 'Cast error: "roles.0" must be a [string]',
                    "isActive": 'Cast error: "isActive" must be a Boolean'
                  },
                  "message": "Validation failed."
                }
              }
            },
            "emptyData": {
              "summary": "Empty data for required fields",
              "description": "The data that were provided for the required fields are empty.",
              "value": {
                "status": false,
                "data": {
                  "name": "ValidationError",
                  "statusCode": 400,
                  "errors": {
                    "firstname": '"firstname" is required field',
                    "lastname": '"lastname" is required field',
                    "isActive": '"isActive" is required field'
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
                    "firstname": '"firstname" must contain at least 2 characters (only letters) and no spaces',
                    "lastname": '"lastname" must contain at least 2 characters (only letters) and no spaces',
                    "roles.0": '"N/A" is not supported value'
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

exports.deleteUser = {
  "tags": ["users"],
  "description": "Deletes the user with the given <b>ID</b>.",
  "operationId": "deleteUser",
  "parameters": [
    { "$ref": "#/components/parameters/userIdParam" }
  ],
  "responses": {
    "200": {
      "description": "User was deleted succesfully. Returns the deleted user.",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserSuccess"
          },
          "example": {
            "status": true,
            "data": {
              "username": "test1@example.com",
              "firstname": "TESTA",
              "lastname": "USERA",
              "roles": [
                "ADMIN"
              ],
              "isActive": true,
              "favorites": [],
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
      "$ref": "#/components/responses/userIdNotFound"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};