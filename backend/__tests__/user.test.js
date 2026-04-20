const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const userService = require('../services/user.service');
const authService = require('../services/auth.service');

// Mock data for the users that will be used for the tests
const invalidId = '69a18fe0c 3aac9024a00a9';
const notFoundId = '000000000000000000000000';
const user1 = {
  username: 'test1@example.com',
  password: 'test1P@ss',
  firstname: 'TestA',
  lastname: 'UserA',
  roles: ['ADMIN', 'EDITOR', 'READER']
};
const user2 = {
  username: 'test2@example.com',
  password: 'test2P@ss',
  firstname: 'TestB',
  lastname: 'UserB'
};
const user3 = {
  username: ' TEST3@EXAMPLE.COM ',
  password: ' test3P@ss ',
  firstname: ' TestC ',
  lastname: ' UserC ',
  roles: [' reader ']
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

describe('Requests for /api/users', () => {
  describe('GET requests for /api/users', () => {
    // default values for pagination
    const defPageSize = 10;
    const defPageNumber = 1;

    test('GET Returns a list with ALL the users - no filtering, default settings for sorting and pagination', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.totalDocuments).toBe(5);
      expect(res.body.data.totalPages).toBe(1);
      expect(res.body.data.pageSize).toBe(defPageSize);
      expect(res.body.data.currentPage).toBe(defPageNumber);
      expect(res.body.data.currentPageSize).toBe(5);
      expect(res.body.data.documents).toHaveLength(5);
      expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
      expect(res.body.data.documents[4].username).toBe('jane@example.com');
    });

    test('GET Returns a list with the users filtered by `createdAt_gte`, `createdAt_lt` and `firstname`, sorted by `lastname` DESC, and paginated with `pageSize=1` and `pageNumber=2`', async () => {
      const filter1 = 'createdAt_gte';
      const value1 = '2026-03';
      const filter2 = 'createdAt_lt';
      const value2 = '2026-04';
      const filter3 = 'firstname';
      const value3 = 'he';
      const sortField = 'lastname';
      const sortDir = -1;
      const pageSize = 1;
      const pageNumber = 2;
      const res = await request(app)
        .get(`/api/users?${filter1}=${value1}&${filter2}=${value2}&${filter3}=${value3}&sortBy_${sortField}=${sortDir}&pageSize=${pageSize}&pageNumber=${pageNumber}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.totalDocuments).toBe(2);
      expect(res.body.data.totalPages).toBe(2);
      expect(res.body.data.pageSize).toBe(pageSize);
      expect(res.body.data.currentPage).toBe(pageNumber);
      expect(res.body.data.currentPageSize).toBe(1);
      expect(res.body.data.documents).toHaveLength(1);
      expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
    });

    test('GET Returns a list with ALL the users - AppNotAuthorizedError - no token provided', async () => {
      const res = await request(app)
        .get('/api/users');

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('GET Returns a list with ALL the users - AccessDeniedError - token has expired', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('GET Returns a list with ALL the users - AccessDeniedError - invalid signature', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${invalidSignature}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('GET Returns a list with ALL the users - AccessDeniedError - token does not have the correct format', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${malformedToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });

    describe('Tests only for Filtering', () => {
      // Positive scenarios
      test('GET Returns a list with the users filtered by `createdAt_gte` (comparison) - default settings for sorting and pagination', async () => {
        const filter = 'createdAt_gte';
        const value = '2026-03-30';
        const res = await request(app)
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(3);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(3);
        expect(res.body.data.documents).toHaveLength(3);
        expect(res.body.data.documents[0].username).toBe('oscar@example.com');
        expect(res.body.data.documents[2].username).toBe('jane@example.com');
      });

      test('GET Returns a list with the users filtered by `createdAt_gte` and `createdAt_lte` (comparison, multiple fields) - default settings for sorting and pagination', async () => {
        const filter1 = 'createdAt_gte';
        const value1 = '2026-03-30';
        const filter2 = 'createdAt_lte';
        const value2 = '2026-04-02';
        const res = await request(app)
          .get(`/api/users?${filter1}=${value1}&${filter2}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].username).toBe('oscar@example.com');
        expect(res.body.data.documents[1].username).toBe('lizzy@example.com');
      });

      test('GET Returns a list with the users filtered by `createdAt` (exact match) - default settings for sorting and pagination', async () => {
        const filter = 'createdAt';
        const value = '2026-04-01T05:38:02.100Z';
        const res = await request(app)
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].username).toBe('lizzy@example.com');
      });

      test('GET Returns a list with the users filtered by `createdAt` (exact match, filter appears multiple times) - default settings for sorting and pagination', async () => {
        const filter = 'createdAt';
        const value1 = '2026-04-01T05:38:02.100Z';
        const value2 = '2026-03-29T09:19:15.544Z';
        const res = await request(app)
          .get(`/api/users?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[1].username).toBe('lizzy@example.com');
      });

      test('GET Returns a list with the users filtered by `createdAt` and `updatedAt` (exact match, multiple fields) - default settings for sorting and pagination', async () => {
        const filter1 = 'createdAt';
        const value1 = '2026-03-29T09:19:15.544Z';
        const filter2 = 'uodatedAt';
        const value2 = '2026-03-29T09:19:15.544Z';
        const res = await request(app)
          .get(`/api/users?${filter1}=${value1}&${filter2}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
      });

      test('GET Returns a list with the users filtered by `firstname` (regexp) - default settings for sorting and pagination', async () => {
        const filter = 'firstname';
        const value = 'he';
        const res = await request(app)
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(2);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[1].username).toBe('hercule@example.com');
      });

      test('GET Returns a list with the users filtered by `firstname` (regexp, filter appears multiple times) - default settings for sorting and pagination', async () => {
        const filter = 'firstname';
        const value1 = 'he';
        const value2 = 'eliza';
        const res = await request(app)
          .get(`/api/users?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(3);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(3);
        expect(res.body.data.documents).toHaveLength(3);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[2].username).toBe('lizzy@example.com');
      });

      test('GET Returns a list with the users filtered by `firstname` and `lastname` (regexp, multiple fields) - default settings for sorting and pagination', async () => {
        const filter1 = 'firstname';
        const value1 = 'he';
        const filter2 = 'lastname';
        const value2 = 'poir';
        const res = await request(app)
          .get(`/api/users?${filter1}=${value1}&${filter2}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].username).toBe('hercule@example.com');
      });

      test('GET Returns a list with the users filtered by combination of fields - default settings for sorting and pagination', async () => {
        const filter1 = 'createdAt_gte';
        const value1 = '2026-03-30';
        const filter2 = 'isActive';
        const value2 = 'true';
        const filter3 = 'roles';
        const value3 = 'editor';
        const filter4 = 'roles';
        const value4 = 'reader';
        const filter5 = 'lastname';
        const value5 = 'bennet';
        const res = await request(app)
          .get(`/api/users?${filter1}=${value1}&${filter2}=${value2}&${filter3}=${value3}&${filter4}=${value4}&${filter5}=${value5}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(1);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(1);
        expect(res.body.data.documents).toHaveLength(1);
        expect(res.body.data.documents[0].username).toBe('lizzy@example.com');
      });

      // Negative scenarios
      test('GET Returns a list with the users filtered by an invalid filter - default settings for sorting and pagination', async () => {
        const filter = 'favorites.title';
        const value = 'The';
        const res = await request(app)
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with the users filtered by `createdAt_gte` (comparison, filter appears multiple times) - default settings for sorting and pagination', async () => {
        const filter = 'createdAt_gte';
        const value1 = '2026-03-30';
        const value2 = '2026-04-02';
        const res = await request(app)
          .get(`/api/users?${filter}=${value1}&${filter}=${value2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with the users filtered by `_id` (type ObjectId) - default settings for sorting and pagination - ValidationError - casting fails', async () => {
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
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.data).toEqual(errData);
      });

      test('GET Returns a list with the users filtered by `isActive` (type Boolean) - default settings for sorting and pagination - ValidationError - casting fails', async () => {
        const filter = 'isActive';
        const value = 'TRUE';
        const errData = {
          name: 'ValidationError',
          statusCode: 400,
          errors: {
            isActive: `Cast error: "isActive" must be a Boolean`
          },
          message: 'Validation failed.'
        };
        const res = await request(app)
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.data).toEqual(errData);
      });

      test('GET Returns a list with the users filtered by `createdAt` (type Date) - default settings for sorting and pagination - ValidationError - casting fails', async () => {
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
          .get(`/api/users?${filter}=${value}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.data).toEqual(errData);
      });
    });

    describe('Tests only for Sorting', () => {
      // Positive scenarios
      test('GET Returns a list with ALL the users sorted by `id` ASC - no filtering, default settings for pagination', async () => {
        const sortField = 'id';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted by `lastname` ASC - no filtering, default settings for pagination', async () => {
        const sortField = 'lastname';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('oscar@example.com');
        expect(res.body.data.documents[1].username).toBe('lizzy@example.com');  // lastname 'Bennet' - position is determined by `_id`
        expect(res.body.data.documents[2].username).toBe('jane@example.com');   // lastname 'Bennet' - position is determined by `_id`
      });

      test('GET Returns a list with ALL the users sorted by `createdAt` DESC - no filtering, default settings for pagination', async () => {
        const sortField = 'createdAt';
        const sortDir = -1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('jane@example.com');
        expect(res.body.data.documents[4].username).toBe('sherlock@example.com');
      });

      test('GET Returns a list with ALL the users sorted by multiple fields (`lastname` ASC and `firstname` DESC) - no filtering, default settings for pagination', async () => {
        const sortField1 = 'lastname';
        const sortDir1 = 1;
        const sortField2 = 'firstname';
        const sortDir2 = -1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField1}=${sortDir1}&sortBy_${sortField2}=${sortDir2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('oscar@example.com');
        expect(res.body.data.documents[1].username).toBe('jane@example.com');   // lastname 'Bennet' - firstname 'Jane'
        expect(res.body.data.documents[2].username).toBe('lizzy@example.com');  // lastname 'Bennet' - firstname 'Elizabeth'
      });

      // Negative scenarios - return results with default sorting
      test('GET Returns a list with ALL the users sorted by `lastname` ASC with wrong format (`sortByfield=sortDir`) - no filtering, default settings for pagination', async () => {
        const prefix = 'sortBy';
        const sortField = 'lastname';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users?${prefix}${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted by `lastname` ASC with wrong format (`sortBY_field=sortDir`) - no filtering, default settings for pagination', async () => {
        const prefix = 'sortBY_';
        const sortField = 'lastname';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users?${prefix}${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted with no field provided - no filtering, default settings for pagination', async () => {
        const sortField = '';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted by an invalid field - no filtering, default settings for pagination', async () => {
        const sortField = 'roles';
        const sortDir = 1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted by `lastname` and invalid value for sortDir (NaN) - no filtering, default settings for pagination', async () => {
        const sortField = 'lastname';
        const sortDir = 'abc';
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted by `lastname` and invalid value for sortDir (!== 1 && !== -1) - no filtering, default settings for pagination', async () => {
        const sortField = 'lastname';
        const sortDir = 2;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users sorted by `lastname` DESC and `lastname` ASC (field appears multiple times) - no filtering, default settings for pagination', async () => {
        const sortField = 'lastname';
        const sortDir1 = -1;
        const sortDir2 = 1;
        const res = await request(app)
          .get(`/api/users?sortBy_${sortField}=${sortDir1}&sortBy_${sortField}=${sortDir2}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });
    });

    describe('Tests only for Pagination', () => {
      // Positive scenarios
      test('GET Returns a list with ALL the users paginated with `pageSize=2` and `pageNumber=2` - no filtering, default settings for sorting', async () => {
        const pageSize = 2;
        const pageNumber = 2;
        const res = await request(app)
          .get(`/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(3);
        expect(res.body.data.pageSize).toBe(pageSize);
        expect(res.body.data.currentPage).toBe(pageNumber);
        expect(res.body.data.currentPageSize).toBe(2);
        expect(res.body.data.documents).toHaveLength(2);
        expect(res.body.data.documents[0].username).toBe('oscar@example.com');
        expect(res.body.data.documents[1].username).toBe('lizzy@example.com');
      });

      // Negative scenarios - return results with default pagination
      test('GET Returns a list with ALL the users paginated with invalid values (NaN) - no filtering, default settings for sorting', async () => {
        const pageSize = ['abc'];
        const pageNumber = 'abc';
        const res = await request(app)
          .get(`/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users paginated with invalid values (<= 0) - no filtering, default settings for sorting', async () => {
        const pageSize = -1;
        const pageNumber = 0;
        const res = await request(app)
          .get(`/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users paginated with invalid values (not integers) - no filtering, default settings for sorting', async () => {
        const pageSize = 1.2;
        const pageNumber = 5.9;
        const res = await request(app)
          .get(`/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });

      test('GET Returns a list with ALL the users paginated with invalid input (fields appear multiple times in the query string) - no filtering, default settings for sorting', async () => {
        const pageSize = 2;
        const pageNumber = 2;
        const res = await request(app)
          .get(`/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}&pageSize=${pageSize}&pageNumber=${pageNumber}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.data.totalDocuments).toBe(5);
        expect(res.body.data.totalPages).toBe(1);
        expect(res.body.data.pageSize).toBe(defPageSize);
        expect(res.body.data.currentPage).toBe(defPageNumber);
        expect(res.body.data.currentPageSize).toBe(5);
        expect(res.body.data.documents).toHaveLength(5);
        expect(res.body.data.documents[0].username).toBe('sherlock@example.com');
        expect(res.body.data.documents[4].username).toBe('jane@example.com');
      });
    });
  });

  describe('POST requests for /api/users', () => {
    test('POST Inserts a user - data for all fields', async () => {
      const user = user1;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(true);
      expect(res.body.data._id).toMatch(/^[a-f0-9]{24}$/);
      expect(res.body.data.favorites).toHaveLength(0);
      expect(res.body.data.createdAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.__v).toBe(0);
    });

    test('POST Inserts a user - data only for required fields', async () => {
      const user = user2;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toHaveLength(0);
      expect(res.body.data.isActive).toBe(true);
      expect(res.body.data._id).toMatch(/^[a-f0-9]{24}$/);
      expect(res.body.data.favorites).toHaveLength(0);
      expect(res.body.data.createdAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.__v).toBe(0);
    });

    test('POST Inserts a user - data to test `trim`, `lowercase`, `uppercase`', async () => {
      const user = user3;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username.trim().toLowerCase());
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname.trim());
      expect(res.body.data.lastname).toBe(user.lastname.trim());
      expect(res.body.data.roles).toHaveLength(user.roles.length);
      expect(res.body.data.roles[0]).toBe(user.roles[0].trim().toUpperCase());
      expect(res.body.data.isActive).toBe(true);
      expect(res.body.data._id).toMatch(/^[a-f0-9]{24}$/);
      expect(res.body.data.favorites).toHaveLength(0);
      expect(res.body.data.createdAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.__v).toBe(0);
    });

    test('POST Inserts a user - ValidationError - casting fails', async () => {
      const user = {
        username: ['test1@example.com'],
        password: ['test1P@ss'],
        firstname: ['TestA'],
        lastname: ['UserA'],
        roles: [['ADMIN'], 'EDITOR', 'READER']
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          username: 'Cast error: "username" must be a string',
          password: 'Cast error: "password" must be a string',
          firstname: 'Cast error: "firstname" must be a string',
          lastname: 'Cast error: "lastname" must be a string',
          'roles.0': 'Cast error: "roles.0" must be a [string]'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a user - ValidationError - no data for required fields', async () => {
      const user = {};
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          username: '"username" is required field',
          password: '"password" is required field',
          firstname: '"firstname" is required field',
          lastname: '"lastname" is required field'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a user - ValidationError - invalid data', async () => {
      const user = {
        username: 'test1example.com',
        password: 'test1Pass',
        firstname: 'Test1',
        lastname: 'User A',
        roles: ['n/a']
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          username: '"username" must be a valid email',
          password: '"password" must contain at least 8 characters amongst which 1 lowercase, 1 uppercase, 1 digit and 1 special character (!@#$%^&+=), and no spaces',
          firstname: '"firstname" must contain at least 2 characters (only letters) and no spaces',
          lastname: '"lastname" must contain at least 2 characters (only letters) and no spaces',
          'roles.0': '"N/A" is not supported value'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a user - ValidationError - invalid data', async () => {
      const user = {
        username: 'test1@examplecom',
        password: 'P@ss1',
        firstname: 'A',
        lastname: 'User1'
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          username: '"username" must be a valid email',
          password: '"password" must contain at least 8 characters amongst which 1 lowercase, 1 uppercase, 1 digit and 1 special character (!@#$%^&+=), and no spaces',
          firstname: '"firstname" must contain at least 2 characters (only letters) and no spaces',
          lastname: '"lastname" must contain at least 2 characters (only letters) and no spaces'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a user - AppEntitytAlreadyExistsError - username (unique field) already exists in DB', async () => {
      const user = user1;
      const errData = {
        name: 'AppEntityAlreadyExistsError',
        statusCode: 409,
        message: 'Username already exists.'
      };
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user);

      expect(res.statusCode).toBe(409);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('POST Inserts a user - AppNotAuthorizedError - no token provided', async () => {
      const user = user1;
      const res = await request(app)
        .post('/api/users')
        .send(user);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('POST Inserts a user - AccessDeniedError - token has expired', async () => {
      const user = user1;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(user);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('POST Inserts a user - AccessDeniedError - invalid signature', async () => {
      const user = user1;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${invalidSignature}`)
        .send(user);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('POST Inserts a user - AccessDeniedError - token does not have the correct format', async () => {
      const user = user1;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${malformedToken}`)
        .send(user);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });
  });
});

describe('Requests for /api/users/:userId', () => {
  describe('GET requests for /api/users/:userId', () => {
    test('GET Returns the user with a given ID - get test user 1', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v);
    });

    test('GET Returns the user with a given ID - ValidationError - casting for user ID fails', async () => {
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
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('GET Returns the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('GET Returns the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const res = await request(app)
        .get(`/api/users/${user._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('GET Returns the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('GET Returns the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${invalidSignature}`);
      
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('GET Returns the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${malformedToken}`);
      
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });
  });

  describe('PATCH requests for /api/users/:userId', () => {
    test('PATCH Updates the user with a given ID - update all fields', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(updates.firstname);
      expect(res.body.data.lastname).toBe(updates.lastname);
      expect(res.body.data.roles).toEqual(updates.roles);
      expect(res.body.data.isActive).toBe(updates.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });

    test('PATCH Updates the user with a given ID - update only one field', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        isActive: true
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(updates.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });

    test('PATCH Updates the user with a given ID - data to test `trim` and `uppercase`', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: ' TestA ',
        lastname: ' UserA ',
        roles: [' editor ', ' reader '],
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(updates.firstname.trim());
      expect(res.body.data.lastname).toBe(updates.lastname.trim());
      expect(res.body.data.roles).toEqual(updates.roles.map(el => el.trim().toUpperCase()));
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).not.toBeNull();
      expect(res.body.data.updatedAt).not.toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v + 1);
    });

    test('PATCH Updates the user with a given ID - ValidationError - casting for user ID fails', async () => {
      const userId = invalidId;
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          _id: 'Cast error: "_id" must be an ObjectId'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('PATCH Updates the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('PATCH Updates the user with a given ID - ValidationError - casting for data fails', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: ['TESTA'],
        lastname: ['USERA'],
        roles: [['READER']],
        isActive: 'FALSE'
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          firstname: 'Cast error: "firstname" must be a string',
          lastname: 'Cast error: "lastname" must be a string',
          'roles.0': 'Cast error: "roles.0" must be a [string]',
          isActive: 'Cast error: "isActive" must be a Boolean'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('PATCH Updates the user with a given ID - ValidationError - empty required fields', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: '',
        lastname: '',
        isActive: null
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          firstname: '"firstname" is required field',
          lastname: '"lastname" is required field',
          isActive: '"isActive" is required field'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('PATCH Updates the user with a given ID - ValidationError - invalid data', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: 'Test1',
        lastname: 'User A',
        roles: ['n/a']
      };
      const errData = {
        name: 'ValidationError',
        statusCode: 400,
        errors: {
          firstname: '"firstname" must contain at least 2 characters (only letters) and no spaces',
          lastname: '"lastname" must contain at least 2 characters (only letters) and no spaces',
          'roles.0': '"N/A" is not supported value'
        },
        message: 'Validation failed.'
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('PATCH Updates the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .send(updates);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('PATCH Updates the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(updates);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('PATCH Updates the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${invalidSignature}`)
        .send(updates);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('PATCH Updates the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const updates = {
        firstname: 'TESTA',
        lastname: 'USERA',
        roles: ['READER'],
        isActive: false
      };
      const res = await request(app)
        .patch(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${malformedToken}`)
        .send(updates);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });
  });

  describe('DELETE requests for /api/users/:userId', () => {
    test('DELETE Deletes the user with a given ID - delete test user 1', async () => {
      const user = await userService.getUserByUsername(user1.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v);
    });

    test('DELETE Deletes the user with a given ID - ValidationError - casting for user ID fails', async () => {
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
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('DELETE Deletes the user with a given ID - AppEntityNotFoundError - no user with the given ID in DB', async () => {
      const userId = notFoundId;
      const errData = {
        name: 'AppEntityNotFoundError',
        statusCode: 404,
        message: `User with 'id=${userId}' not found.`
      };
      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errData);
    });

    test('DELETE Deletes the user with a given ID - AppNotAuthorizedError - no token provided', async () => {
      const user = await userService.getUserByUsername(user2.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err401noToken);
    });

    test('DELETE Deletes the user with a given ID - AccessDeniedError - token has expired', async () => {
      const user = await userService.getUserByUsername(user2.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403expiredToken);
    });

    test('DELETE Deletes the user with a given ID - AccessDeniedError - invalid signature', async () => {
      const user = await userService.getUserByUsername(user2.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${invalidSignature}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403invalidSignature);
    });

    test('DELETE Deletes the user with a given ID - AccessDeniedError - token does not have the correct format', async () => {
      const user = await userService.getUserByUsername(user2.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${malformedToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toEqual(errors.err403malformedToken);
    });

    test('DELETE Deletes the user with a given ID - delete test user 2', async () => {
      const user = await userService.getUserByUsername(user2.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v);
    });

    test('DELETE Deletes the user with a given ID - delete test user 3', async () => {
      const user = await userService.getUserByUsername(user3.username);
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe(user.username);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.firstname).toBe(user.firstname);
      expect(res.body.data.lastname).toBe(user.lastname);
      expect(res.body.data.roles).toEqual(user.roles);
      expect(res.body.data.isActive).toBe(user.isActive);
      expect(res.body.data._id).toBe(user.id);
      expect(res.body.data.favorites).toEqual(user.favorites);
      expect(res.body.data.createdAt).toBe(user.createdAt.toJSON());
      expect(res.body.data.updatedAt).toBe(user.updatedAt.toJSON());
      expect(res.body.data.__v).toBe(user.__v);
    });
  });
});