const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const userService = require('../services/user.service');
const authService = require('../services/auth.service');

// Mock data that will be used for the tests
const username = 'oscar@example.com';
const movieId = '69ca07556571c77163d9a567'  // a random valid ObjectId
const invalidId = '69a18fe0c 3aac9024a00a9';
const notFoundId = '000000000000000000000000';
const movie1 = {
  title: 'The Artist',
  year: 2011,
  runtime: 100,
  genre: ['Comedy', 'Drama', 'Romance'],
  director: ['Michel Hazanavicius'],
  writer: ['Michel Hazanavicius'],
  actors: ['Jean Dujardin', 'Bérénice Bejo', 'John Goodman'],
  plot: 'Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.',
  language: ['English', 'French'],
  poster: 'https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg',
  imdbRating: 7.8,
  imdbId: 'tt1655442'
};
const movie2 = {
  title: ' The King\'s Speech ',
  year: 2010,
  runtime: 118,
  genre: [' Biography ', ' Drama ', ' History '],
  director: [' Tom Hooper '],
  writer: [' David Seidler '],
  actors: [' Colin Firth ', ' Geoffrey Rush ', ' Helena Bonham Carter '],
  plot: ' Britain\'s Prince Albert (Colin Firth) must ascend the throne as King George VI, but he has a speech impediment. Knowing that the country needs her husband to be able to communicate effectively, Elizabeth (Helena Bonham Carter) hires Lionel Logue (Geoffrey Rush), an Australian actor and speech therapist, to help him overcome his stammer. An extraordinary friendship develops between the two men, as Logue uses unconventional means to teach the monarch how to speak with confidence. ',
  language: [' English '],
  poster: ' https://m.media-amazon.com/images/M/MV5BMzU5MjEwMTg2Nl5BMl5BanBnXkFtZTcwNzM3MTYxNA@@._V1_SX300.jpg ',
  imdbRating: 8.0,
  imdbId: ' tt1504320 '
};

// Mock data to create tokens for testing Authentication
const admin = {
  _id: '69b0097d64c2925feca9063c',
  username: 'admin@example.com',
  firstname: 'Admin',
  roles: ['ADMIN']
};

// Test tokens
const adminToken = authService.generateAccessToken(admin);
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTVlZjE1ZWNhMGI5ZTZhNDhhNjkyOCIsInVzZXJuYW1lIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJmaXJzdG5hbWUiOiJBZG1pbiIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTc3NjY3NjY4OCwiZXhwIjoxNzc2Njc2NjkzfQ.9rWzcw2ntRBo86A8FwPJnx_0RAtana3QP7aarbOenXw';
const invalidSignature = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGNydWQuY29tIiwiZmlyc3RuYW1lIjoiVGFuaWEiLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3NzMwOTU1MTUsImV4cCI6MTc3MzA5OTExNX0.pRUGflVd467xrBCBEL3F8eagE1XAhJtdkJQm8UgMxRs';
const malformedToken = '$123 456';

// Default error responses
const errors = {
  err401noToken: {
    name: 'AppNotAuthorizedError',
    statusCode: 401,
    message: 'Access Denied: no token provided'
  },
  err403expiredToken: {
    name: 'AccessDeniedError',
    statusCode: 403,
    message: 'Access Denied: jwt expired'
  },
  err403invalidSignature: {
    name: 'AccessDeniedError',
    statusCode: 403,
    message: 'Access Denied: invalid signature'
  },
  err403malformedToken: {
    name: 'AccessDeniedError',
    statusCode: 403,
    message: 'Access Denied: jwt malformed'
  }
};

const connectOptions = {
  dbName: 'moviesdb',
  retryWrites: true,
  writeConcern: {
    w: 'majority'
  }
};

// Connect to MongoDB
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI, connectOptions)
  .then(
    () => console.log('Connection to MongoDB for Jest established'),
    err => console.error('Failed to connect to MongoDB for Jest', err)
  );
});

// Close connection to MongoDB
afterEach(async () => {
  await mongoose.connection.close();
});

describe('Requests for /api/users/:userId/favorites', () => {
  describe('GET requests for /api/users/:userId/favorites', () => {
    // default values for pagination
    const defPageSize = 10;
    const defPageNumber = 1;

    test('GET Returns a list with ALL the favorites of the user with a given ID - no filtering, default settings for sorting and pagination', async () => {
      const user = await userService.getUserByUsername(username);
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.totalDocuments).toBe(12);
      expect(res.body.data.totalPages).toBe(2);
      expect(res.body.data.pageSize).toBe(defPageSize);
      expect(res.body.data.currentPage).toBe(defPageNumber);
      expect(res.body.data.currentPageSize).toBe(10);
      expect(res.body.data.documents).toHaveLength(10);
      expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
      expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
    });

    test('GET Returns a list with the favorites of the user with a given ID, filtered by `imdbRating_gte` and `genre`, sorted by `title` DESC, and paginated with `pageSize=1` and `pageNumber=2`', async () => {
      const user = await userService.getUserByUsername(username);
      const filter1 = 'imdbRating_gte';
      const value1 = '8';
      const filter2 = 'genre';
      const value2 = 'cr';
      const sortField = 'title';
      const sortDir = -1;
      const pageSize = 1;
      const pageNumber = 2;
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites?${filter1}=${value1}&${filter2}=${value2}&sortBy_${sortField}=${sortDir}&pageSize=${pageSize}&pageNumber=${pageNumber}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.totalDocuments).toBe(2);
      expect(res.body.data.totalPages).toBe(2);
      expect(res.body.data.pageSize).toBe(pageSize);
      expect(res.body.data.currentPage).toBe(pageNumber);
      expect(res.body.data.currentPageSize).toBe(1);
      expect(res.body.data.documents).toHaveLength(1);
      expect(res.body.data.documents[0].title).toBe('Slumdog Millionaire');
    });

    test('GET Returns a list with ALL the favorites of the user with a given ID - ValidationError - casting for user ID fails', async () => {
      const userId = invalidId;
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          _id: 'Cast error: "_id" must be an ObjectId'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .get(`/api/users/${userId}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('GET Returns a list with ALL the favorites of the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .get(`/api/users/${userId}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('GET Returns a list with ALL the favorites of the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(username);
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites`);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('GET Returns a list with ALL the favorites of the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(username);
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('GET Returns a list with ALL the favorites of the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(username);
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${invalidSignature}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('GET Returns a list with ALL the favorites of the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(username);
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${malformedToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });

    describe('Tests only for Filtering', () => {
      // Positive scenarios
      test('GET Returns a list with the favorites of the user with a given ID, filtered by `imdbRating_gte` (comparison - type Number) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'imdbRating_gte';
        const value = '8.3';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(7);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(7);
        expect(res.body.data.documents).toHaveLength(7);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
        expect(res.body.data.documents[6].title).toBe('Forrest Gump');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `imdbRating_gte` and `imdbRating_lte` (comparison, multiple fields - type Number) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter1 = 'imdbRating_gte';
        const value1 = '8.3';
        const filter2 = 'imdbRating_lte';
        const value2 = '8.5';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter1}=${value1}&${filter2}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(4);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(4);
        expect(res.body.data.documents).toHaveLength(4);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
        expect(res.body.data.documents[3].title).toBe('Gladiator');

      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `createdAt_gte` (comparison - type Date) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'createdAt_gte';
        const value = '2026-04-01';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(6);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(6);
        expect(res.body.data.documents).toHaveLength(6);
        expect(res.body.data.documents[0].title).toBe('Lawrence of Arabia');
        expect(res.body.data.documents[5].title).toBe('Forrest Gump');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `createdAt_gte` and `createdAt_lte` (comparison, multiple fields - type Date) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter1 = 'createdAt_gte';
        const value1 = '2026-04-01';
        const filter2 = 'createdAt_lte';
        const value2 = '2026-04-06';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter1}=${value1}&${filter2}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(3);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(3);
        expect(res.body.data.documents).toHaveLength(3);
        expect(res.body.data.documents[0].title).toBe('Lawrence of Arabia');
        expect(res.body.data.documents[2].title).toBe('Slumdog Millionaire');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `_id` (exact match - type ObjectId) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = '_id';
        const value = '69ca087c4613b302effb2392';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `_id` (exact match, filter appears multiple times - type ObjectId) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = '_id';
        const value1 = '69ca087c4613b302effb2392';
        const value2 = '69d4aafdab3a371c429451c8';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
        expect(res.body.data.documents[1].title).toBe('Driving Miss Daisy');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `imdbRating` (exact match - type Number) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'imdbRating';
        const value = '8';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].title).toBe('CODA');
        expect(res.body.data.documents[1].title).toBe('Slumdog Millionaire');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `imdbRating` (exact match, filter appears multiple times - type Number) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'imdbRating';
        const value1 = '8';
        const value2 = '8.5';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(4);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(4);
        expect(res.body.data.documents).toHaveLength(4);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
        expect(res.body.data.documents[3].title).toBe('Gladiator');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `createdAt` (exact match - type Date) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'createdAt';
        const value = '2026-04-07T07:00:58.368Z';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].title).toBe('Forrest Gump');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `createdAt` (exact match, filter appears multiple times - type Date) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'createdAt';
        const value1 = '2026-04-07T07:00:58.368Z';
        const value2 = '2026-04-01T05:38:58.718Z';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].title).toBe('Amadeus');
        expect(res.body.data.documents[1].title).toBe('Forrest Gump');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `_id`, `year` and `createdAt` (exact match, multiple fields) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter1 = '_id';
        const value1 = '69ca087c4613b302effb2392';
        const filter2 = 'year';
        const value2 = '1942';
        const filter3 = 'createdAt';
        const value3 = '2026-03-30T05:22:04.334Z';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter1}=${value1}&${filter2}=${value2}&${filter3}=${value3}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `genre` (regexp) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'genre';
        const value = 'cr';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].title).toBe('The Godfather');
        expect(res.body.data.documents[1].title).toBe('Slumdog Millionaire');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `genre` (regexp, filter appears multiple times) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'genre';
        const value1 = 'cr';
        const value2 = 'ro';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(4);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(4);
        expect(res.body.data.documents).toHaveLength(4);
        expect(res.body.data.documents[0].title).toBe('Casablanca');
        expect(res.body.data.documents[3].title).toBe('Forrest Gump');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `genre`, `director` and `language` (regexp, multiple fields) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter1 = 'genre';
        const value1 = 'bio';
        const filter2 = 'director';
        const value2 = 'ste';
        const filter3 = 'language';
        const value3 = 'german';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter1}=${value1}&${filter2}=${value2}&${filter3}=${value3}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].title).toBe('Schindler\'s List');
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by combination of fields - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter1 = 'genre';
        const value1 = 'bio';
        const filter2 = 'year_gte';
        const value2 = '1990';
        const filter3 = 'createdAt_gte';
        const value3 = '2026-03-31';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter1}=${value1}&${filter2}=${value2}&${filter3}=${value3}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].title).toBe('12 Years a Slave');
        expect(res.body.data.documents[1].title).toBe('Oppenheimer');
      });

      // Negative scenarios
      test('GET Returns a list with the favorites of the user with a given ID, filtered by an invalid filter - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'invalid';
        const value = '8.3';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `createdAt_gte` (comparison, filter appears multiple times) - default settings for sorting and pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'createdAt_gte';
        const value1 = '2026-03-30';
        const value2 = '2026-04-02';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `_id` (type ObjectId) - default settings for sorting and pagination - ValidationError - casting fails', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = '_id';
        const value = invalidId;
        const errData = {
          name: 'ValidationError',
          statusCode: 400,
          errors: {
            _id: `Cast error: "_id" must be an ObjectId`
          },
          message: 'Validation failed.'
        };
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.data).toEqual(errData);
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `imdbRating_gte` (type Number) - default settings for sorting and pagination - ValidationError - casting fails', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'imdbRating_gte';
        const value = 'abc';
        const errData = {
          name: 'ValidationError',
          statusCode: 400,
          errors: {
            imdbRating_gte: `Cast error: "imdbRating_gte" must be a number`
          },
          message: 'Validation failed.'
        };
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.data).toEqual(errData);
      });

      test('GET Returns a list with the favorites of the user with a given ID, filtered by `createdAt` (type Date) - default settings for sorting and pagination - ValidationError - casting fails', async () => {
        const user = await userService.getUserByUsername(username);
        const filter = 'createdAt';
        const value = '20';
        const errData = {
          name: 'ValidationError',
          statusCode: 400,
          errors: {
            createdAt: `Cast error: "createdAt" must be a date`
          },
          message: 'Validation failed.'
        };
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.data).toEqual(errData);
      });
    });

    describe('Tests only for Sorting', () => {
      // Positive scenarios
      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `id` ASC - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'id';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `title` ASC - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'title';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe('12 Years a Slave');
        expect(res.body.data.documents[9].title).toBe('Schindler\'s List');
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `imdbRating` DESC - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'imdbRating';
        const sortDir = -1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe('The Godfather');
        expect(res.body.data.documents[3].title).toBe('Casablanca');    // imdbRating '8.5' - position is determined by `_id`
        expect(res.body.data.documents[4].title).toBe('Gladiator');     // imdbRating '8.5' - position is determined by `_id`
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `createdAt` DESC - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'createdAt';
        const sortDir = -1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[11].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[2].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by multiple fields (`imdbRating` DESC and `year` DESC) - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField1 = 'imdbRating';
        const sortDir1 = -1;
        const sortField2 = 'year';
        const sortDir2 = -1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField1}=${sortDir1}&sortBy_${sortField2}=${sortDir2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe('The Godfather');
        expect(res.body.data.documents[3].title).toBe('Gladiator');     // imdbRating '8.5' - year `2000`
        expect(res.body.data.documents[4].title).toBe('Casablanca');    // imdbRating '8.5' - year `1942`
      });

      // Negative scenarios - return results with default sorting
      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `title` ASC with wrong format (`sortByfield=sortDir`) - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'title';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `title` ASC with wrong format (`sortBY_field=sortDir`) - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'title';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBY_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted with no field provided - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = '';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by an invalid field - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'language';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `title` and invalid value for sortDir (NaN) - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'title';
        const sortDir = 'abc';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `title` and invalid value for sortDir (!== 1 && !== -1) - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'title';
        const sortDir = 2;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, sorted by `title` DESC and `title` ASC (field appears multiple times) - no filtering, default settings for pagination', async () => {
        const user = await userService.getUserByUsername(username);
        const sortField = 'title';
        const sortDir1 = -1;
        const sortDir2 = 1;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?sortBy_${sortField}=${sortDir1}&sortBy_${sortField}=${sortDir2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });
    });

    describe('Tests only for Pagination', () => {
      // Positive scenarios
      test('GET Returns a list with ALL the favorites of the user with a given ID, paginated with `pageSize=5` and `pageNumber=3` - no filtering, default settings for sorting', async () => {
        const user = await userService.getUserByUsername(username);
        const pageSize = 5;
        const pageNumber = 3;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(3);
        expect(res.body.data.pageSize).toBe(pageSize);
        expect(res.body.data.currentPage).toBe(pageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].title).toBe(user.favorites[10].title);
        expect(res.body.data.documents[1].title).toBe(user.favorites[11].title);
      });

      // Negative scenarios - return results with default pagination
      test('GET Returns a list with ALL the favorites of the user with a given ID, paginated with invalid values (NaN) - no filtering, default settings for sorting', async () => {
        const user = await userService.getUserByUsername(username);
        const pageSize = ['abc'];
        const pageNumber = 'abc';
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, paginated with invalid values (<= 0) - no filtering, default settings for sorting', async () => {
        const user = await userService.getUserByUsername(username);
        const pageSize = -1;
        const pageNumber = 0;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, paginated with invalid values (not integers) - no filtering, default settings for sorting', async () => {
        const user = await userService.getUserByUsername(username);
        const pageSize = 1.2;
        const pageNumber = 5.9;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });

      test('GET Returns a list with ALL the favorites of the user with a given ID, paginated with invalid input (fields appear multiple times in the query string) - no filtering, default settings for sorting', async () => {
        const user = await userService.getUserByUsername(username);
        const pageSize = 5;
        const pageNumber = 3;
        const res = await request(app)
          .get(`/api/users/${user._id}/favorites?pageSize=${pageSize}&pageNumber=${pageNumber}&pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(12);
        expect(res.body.data.totalPages).toBe(2);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(10);
        expect(res.body.data.documents).toHaveLength(10);
        expect(res.body.data.documents[0].title).toBe(user.favorites[0].title);
        expect(res.body.data.documents[9].title).toBe(user.favorites[9].title);
      });
    });
  });

  describe('POST requests for /api/users/:userId/favorites', () => {
    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - data for all fields', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie1;
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data.favorites).toHaveLength(user.favorites.length + 1);
      expect(res.body.data.favorites.at(-1).title).toBe(favorite.title);
      expect(res.body.data.favorites.at(-1).year).toBe(favorite.year);
      expect(res.body.data.favorites.at(-1).runtime).toBe(favorite.runtime);
      expect(res.body.data.favorites.at(-1).genre).toEqual(favorite.genre);
      expect(res.body.data.favorites.at(-1).director).toEqual(favorite.director);
      expect(res.body.data.favorites.at(-1).writer).toEqual(favorite.writer);
      expect(res.body.data.favorites.at(-1).actors).toEqual(favorite.actors);
      expect(res.body.data.favorites.at(-1).plot).toBe(favorite.plot);
      expect(res.body.data.favorites.at(-1).language).toEqual(favorite.language);
      expect(res.body.data.favorites.at(-1).poster).toBe(favorite.poster);
      expect(res.body.data.favorites.at(-1).imdbRating).toBe(favorite.imdbRating);
      expect(res.body.data.favorites.at(-1).imdbId).toBe(favorite.imdbId);
      expect(res.body.data.favorites.at(-1)._id).toMatch(/^[a-f0-9]{24}$/);
      expect(res.body.data.favorites.at(-1).createdAt).not.toBeNull();
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - data to test `trim`', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie2;
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data.favorites).toHaveLength(user.favorites.length + 1);
      expect(res.body.data.favorites.at(-1).title).toBe(favorite.title.trim());
      expect(res.body.data.favorites.at(-1).year).toBe(favorite.year);
      expect(res.body.data.favorites.at(-1).runtime).toBe(favorite.runtime);
      expect(res.body.data.favorites.at(-1).genre).toEqual(favorite.genre.map(el => el.trim()));
      expect(res.body.data.favorites.at(-1).director).toEqual(favorite.director.map(el => el.trim()));
      expect(res.body.data.favorites.at(-1).writer).toEqual(favorite.writer.map(el => el.trim()));
      expect(res.body.data.favorites.at(-1).actors).toEqual(favorite.actors.map(el => el.trim()));
      expect(res.body.data.favorites.at(-1).plot).toBe(favorite.plot.trim());
      expect(res.body.data.favorites.at(-1).language).toEqual(favorite.language.map(el => el.trim()));
      expect(res.body.data.favorites.at(-1).poster).toBe(favorite.poster.trim());
      expect(res.body.data.favorites.at(-1).imdbRating).toBe(favorite.imdbRating);
      expect(res.body.data.favorites.at(-1).imdbId).toBe(favorite.imdbId.trim());
      expect(res.body.data.favorites.at(-1)._id).toMatch(/^[a-f0-9]{24}$/);
      expect(res.body.data.favorites.at(-1).createdAt).not.toBeNull();
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - ValidationError - casting for user ID fails', async () => {
      const userId = invalidId;
      const favorite = movie1;
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          _id: 'Cast error: "_id" must be an ObjectId'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post(`/api/users/${userId}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const favorite = movie1;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .post(`/api/users/${userId}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - ValidationError - casting for `imdbId` fails', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = {
        imdbId: ['tt']   // fails to cast to a string
      }; 
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          'favorites.14.imdbId': 'Cast error: "imdbId" must be a string'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - AppEntityAlreadyExistsError - imdbId (unique field) already exists in `Favorites`', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie1;
      const errData = {
        name: 'AppEntityAlreadyExistsError',
        statusCode: 409,
        message: 'Movie already exists.'
      };
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(409);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - ValidationError - casting for data fails', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = {
        title: ['The Artist'],
        year: [2011],
        runtime: [100],
        genre: [['Comedy'], 'Drama', 'Romance'],
        director: [['Michel Hazanavicius']],
        writer: [['Michel Hazanavicius']],
        actors: [['Jean Dujardin'], 'Bérénice Bejo', 'John Goodman'],
        plot: ['Outside a movie premiere, enthusiastic fan Peppy Miller literally bumps into the swashbuckling hero of the silent film, George Valentin. The star reacts graciously and Peppy plants a kiss on his cheek as they are surrounded by photographers. The headlines demand: \"Who\'s That Girl?\" and Peppy is inspired to audition for a dancing bit-part at the studio. However as Peppy slowly rises through the industry, the introduction of talking-pictures turns Valentin\'s world upside-down.'],
        language: [['English'], 'French'],
        poster: ['https://m.media-amazon.com/images/M/MV5BYjEwOGZmM2QtNjY4Mi00NjI0LTkyZjItZDEzZGI1YTEzMDg1XkEyXkFqcGc@._V1_SX300.jpg'],
        imdbRating: [7.8],
        imdbId: ['tt165544']
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          'favorites.14.title': 'Cast error: "title" must be a string',
          'favorites.14.year': 'Cast error: "year" must be a Number',
          'favorites.14.runtime': 'Cast error: "runtime" must be a Number',
          'favorites.14.genre.0': 'Cast error: "genre.0" must be a [string]',
          'favorites.14.director.0': 'Cast error: "director.0" must be a [string]',
          'favorites.14.writer.0': 'Cast error: "writer.0" must be a [string]',
          'favorites.14.actors.0': 'Cast error: "actors.0" must be a [string]',
          'favorites.14.plot': 'Cast error: "plot" must be a string',
          'favorites.14.language.0': 'Cast error: "language.0" must be a [string]',
          'favorites.14.poster': 'Cast error: "poster" must be a string',
          'favorites.14.imdbRating': 'Cast error: "imdbRating" must be a Number',
          'favorites.14.imdbId': 'Cast error: "imdbId" must be a string'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - ValidationError - invalid data (number values less than min)', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = {
        year: 1887,
        runtime: 0,
        imdbRating: -1
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          'favorites.14.year': '"year" must be between 1888 and 2100',
          'favorites.14.runtime': '"runtime" must be > 0',
          'favorites.14.imdbRating': '"imdbRating" must be between 0 and 10'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - ValidationError - invalid data (number values greater than max)', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = {
        year: 2101,
        imdbRating: 10.01
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          'favorites.14.year': '"year" must be between 1888 and 2100',
          'favorites.14.imdbRating': '"imdbRating" must be between 0 and 10'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - ValidationError - invalid data (number values not integers)', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = {
        year: 2026.5,
        runtime: 115.5
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          'favorites.14.year': '"year" must be an integer',
          'favorites.14.runtime': '"runtime" must be an integer'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie1;
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .send(favorite);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie1;
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie1;
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${invalidSignature}`)
        .send(favorite);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('POST Inserts a movie to the `Favorites` list of the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = movie1;
      const res = await request(app)
        .post(`/api/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${malformedToken}`)
        .send(favorite);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });
  });
});

describe('Requests for /api/users/:userId/favorites/:favoriteId', () => {
  describe('GET requests for /api/users/:userId/favorites/:favoriteId', () => {
    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.title).toBe(favorite.title);
      expect(res.body.data.year).toBe(favorite.year);
      expect(res.body.data.runtime).toBe(favorite.runtime);
      expect(res.body.data.genre).toEqual(favorite.genre);
      expect(res.body.data.director).toEqual(favorite.director);
      expect(res.body.data.writer).toEqual(favorite.writer);
      expect(res.body.data.actors).toEqual(favorite.actors);
      expect(res.body.data.plot).toBe(favorite.plot);
      expect(res.body.data.language).toEqual(favorite.language);
      expect(res.body.data.poster).toBe(favorite.poster);
      expect(res.body.data.imdbRating).toBe(favorite.imdbRating);
      expect(res.body.data.imdbId).toBe(favorite.imdbId);
      expect(res.body.data._id).toBe(favorite.id);
      expect(res.body.data.createdAt).toBe(favorite.createdAt.toJSON());
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - ValidationError - casting for user ID fails', async () => {
      const userId = invalidId;
      const favoriteId = movieId;
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          _id: 'Cast error: "_id" must be an ObjectId'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .get(`/api/users/${userId}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const favoriteId = movieId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .get(`/api/users/${userId}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - AppEntityNotFoundError - no movie with the given ID in `Favorites` list', async () => {
      const user = await userService.getUserByUsername(username);
      const favoriteId = notFoundId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `Movie with 'id=${favoriteId}' not found.`
      };
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites/${favorite._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${invalidSignature}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('Get Returns the movie with a given ID from the `Favorites` list of the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .get(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${malformedToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });
  });

  describe('DELETE requests for /api/users/:userId/favorites/:favoriteId', () => {
    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - remove movie 2', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data.favorites).toHaveLength(user.favorites.length - 1);
      expect(res.body.data.favorites.at(-1).imdbId).not.toBe(favorite.imdbId);  // unique field
      expect(res.body.data.favorites.at(-1)._id).not.toBe(favorite.id);         // unique field
      expect(res.body.data.favorites.at(-1).createdAt).not.toBe(favorite.createdAt.toJSON());
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - ValidationError - casting for user ID fails', async () => {
      const userId = invalidId;
      const favoriteId = movieId;
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          _id: 'Cast error: "_id" must be an ObjectId'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .delete(`/api/users/${userId}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const favoriteId = movieId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .delete(`/api/users/${userId}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - ValidationError - casting for `favoriteId` fails', async () => {
      const user = await userService.getUserByUsername(username);
      const favoriteId = invalidId;
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          _id: 'Cast error: "_id" must be an ObjectId'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - AppEntityNotFoundError - no movie with the given ID in `Favorites` list', async () => {
      const user = await userService.getUserByUsername(username);
      const favoriteId = notFoundId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `Movie with 'id=${favoriteId}' not found.`
      };
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favorite._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${invalidSignature}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${malformedToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });

    test('DELETE Deletes the movie with a given ID from the `Favorites` list of the user with a given ID - remove movie 1', async () => {
      const user = await userService.getUserByUsername(username);
      const favorite = user.favorites.at(-1);   // the last inserted movie
      const res = await request(app)
        .delete(`/api/users/${user._id}/favorites/${favorite._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data.favorites).toHaveLength(user.favorites.length - 1);
      expect(res.body.data.favorites.at(-1).imdbId).not.toBe(favorite.imdbId);  // unique field
      expect(res.body.data.favorites.at(-1)._id).not.toBe(favorite.id);         // unique field
      expect(res.body.data.favorites.at(-1).createdAt).not.toBe(favorite.createdAt.toJSON());
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });
  });
});