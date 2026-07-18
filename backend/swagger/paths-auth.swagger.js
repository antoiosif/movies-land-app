exports.register = {
  "tags": ["auth"],
  "description": "Registers a new user.",
  "operationId": "register",
  "security": [],
  "requestBody": {
    "description": "The data of the user to register.",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/UserInsertData"
        },
        "examples": {
          "allFields": {
            "summary": "Positive scenario - Data for all fields",
            "description": "Provides data for all fields, to successfully register a user.",
            "value": {
              "username": "register1@example.com",
              "password": "register1P@ss",
              "firstname": "RegisterA",
              "lastname": "UserA",
              "roles": ["ADMIN", "EDITOR", "READER"]
            }
          },
          "requiredFields": {
            "summary": "Positive scenario - Data only for required fields",
            "description": "Provides data only for the required fields, to successfully register a user.",
            "value": {
              "username": "register2@example.com",
              "password": "register2P@ss",
              "firstname": "RegisterB",
              "lastname": "UserB"
            }
          },
          "castingError": {
            "summary": "Negative scenario - Casting fails",
            "description": "Provides data that can't be cast to the appropriate types of the <b>User</b> schema and a <b>Validation</b> error occurs.",
            "value": {
              "username": ["register1@example.com"],
              "password": ["register1P@ss"],
              "firstname": ["RegisterA"],
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
              "username": "register1example.com",
              "password": "register1Pass",
              "firstname": "Register1",
              "lastname": "User A",
              "roles": ["n/a"]
            }
          },
          "userAlreadyExists": {
            "summary": "Negative scenario - User to register already exists in DB",
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
      "description": "User registered succesfully.",
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
    "409": {
      "$ref": "#/components/responses/userAlreadyExists"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};

exports.login = {
  "tags": ["auth"],
  "description": "Login user. Returns a JWT for valid credentials.",
  "operationId": "login",
  "security": [],
  "requestBody": {
    "description": "The credentials (<b>username</b> and <b>password</b>) of the user to login.",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "format": "email"
            },
            "password": {
              "type": "string",
              "format": "password",
              "pattern": "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&+=])^\S{8,}$",
              "description": "It must contain at least 8 characters amongst which<br>- 1 lowercase,<br>- 1 uppercase,<br>- 1 digit,<br>- 1 special character (!@#$%^&+=),<br>and no spaces."
            }
          },
          "required": ["username", "password"]
        },
        "examples": {
          "validCredentials": {
            "summary": "Positive scenario",
            "description": "Provides valid credentials to successfully login a user.",
            "value": {
              "username": "register1@example.com",
              "password": "register1P@ss"
            }
          },
          "userNotFound": {
            "summary": "Negative scenario - User not found",
            "description": "Provides a <b>username</b> that doesn't correspond to a user in DB and a <b>UserNotFound</b> error occurs.",
            "value": {
              "username": "register@example.com",
              "password": "register1P@ss"
            }
          },
          "userNotActive": {
            "summary": "Negative scenario - User is not Active",
            "description": "Provides a <b>username</b> that corresponds to a user who is not Active and a <b>UserNotAuthorized</b> error occurs (only Active users can login).",
            "value": {
              "username": "jane@example.com",
              "password": "P@ss12345"
            }
          },
          "invalidCredentials": {
            "summary": "Negative scenario - Invalid credentials",
            "description": "Provides invalid credentials and a <b>UserNotAuthorized</b> error occurs.",
            "value": {
              "username": "register1@example.com",
              "password": "register1P@sss"
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "Successful Authentication. Returns a JWT.",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "status": {
                "type": "boolean",
                "const": true
              },
              "data": {
                "type": "string",
                "description": "A JWT."
              }
            },
            "required": ["status", "data"]
          },
          "example": {
            "status": true,
            "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTVlZjE1ZWNhMGI5ZTZhNDhhNjkyOCIsInVzZXJuYW1lIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJmaXJzdG5hbWUiOiJBZG1pbiIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTc3NjY3NjY4OCwiZXhwIjoxNzc2Njc2NjkzfQ.9rWzcw2ntRBo86A8FwPJnx_0RAtana3QP7aarbOenXw"
          }
        }
      }
    },
    "401": {
      "description": "Invalid credentials or the credentials correspond to a user that is not Active (only Active users can login).",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/AppGenericError"
          },
          "examples": {
            "userNotActive": {
              "summary": "User is not Active",
              "description": "The provided <b>username</b> corresponds to a user who is not Active (only Active users can login).",
              "value": {
                "status": false,
                "data": {
                  "name": "AppNotAuthorizedError",
                  "statusCode": 401,
                  "message": "User with 'username=notactive@example.com' is not active."
                }
              }
            },
            "invalidCredentials": {
              "summary": "Invalid credentials",
              "description": "The provided <b>password</b> doesn't match the <b>password</b> that is saved in DB for the user with the given <b>username</b>.",
              "value": {
                "status": false,
                "data": {
                  "name": "AppNotAuthorizedError",
                  "statusCode": 401,
                  "message": "Authentication failed. User with 'username=invalid@example.com' not logged in."
                }
              }
            }
          }
        }
      }
    },
    "404": {
      "$ref": "#/components/responses/userUsernameNotFound"
    },
    "default": {
      "$ref": "#/components/responses/default"
    }
  }
};