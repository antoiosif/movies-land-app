const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const userService = require('../services/user.service');

// Mock data that will be used for the tests
const user1 = {
  username: 'register1@example.com',
  password: 'register1P@ss',
  firstname: 'RegisterA',
  lastname: 'UserA',
  roles: ['ADMIN', 'EDITOR', 'READER']
};
const user2 = {
  username: 'register2@example.com',
  password: 'register2P@ss',
  firstname: 'RegisterB',
  lastname: 'UserB'
};
const user3 = {
  username: ' REGISTER3@EXAMPLE.COM ',
  password: ' register3P@ss ',
  firstname: ' RegisterC ',
  lastname: ' UserC ',
  roles: [' reader ']
};

const connectOptions = {
  dbName: 'moviesdb',
  retryWrites: true,
  writeConcern: {
    w: 'majority'
  }
};

// Connect to MongoDB
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, connectOptions)
  .then(
    () => console.log('Connection to MongoDB for Jest established'),
    err => console.error('Failed to connect to MongoDB for Jest', err)
  );
});

// Close connection to MongoDB
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Requests for /api/auth/register', () => {
  afterAll(async () => {
    const registeredUser1 = await userService.getUserByUsername(user1.username);
    const registeredUser2 = await userService.getUserByUsername(user2.username);
    const registeredUser3 = await userService.getUserByUsername(user3.username);
    await userService.deleteUser(registeredUser1.id);
    await userService.deleteUser(registeredUser2.id);
    await userService.deleteUser(registeredUser3.id);
  });

  test('POST Registers a user - data for all fields', async () => {
    const user = user1;
    const res = await request(app)
      .post('/api/auth/register')
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

  test('POST Registers a user - data only for required fields', async () => {
    const user = user2;
    const res = await request(app)
      .post('/api/auth/register')
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

  test('POST Registers a user - data to test `trim`, `lowercase`, `uppercase`', async () => {
    const user = user3;
    const res = await request(app)
      .post('/api/auth/register')
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

  test('POST Registers a user - ValidationError - casting fails', async () => {
    const user = {
      username: ['register1@example.com'],
      password: ['register1P@ss'],
      firstname: ['RegisterA'],
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
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.data).toEqual(errData);
  });

  test('POST Registers a user - ValidationError - no data for required fields', async () => {
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
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.data).toEqual(errData);
  });

  test('POST Registers a user - ValidationError - invalid data', async () => {
    const user = {
      username: 'register1example.com',
      password: 'register1Pass',
      firstname: 'Register1',
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
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.data).toEqual(errData);
  });

  test('POST Registers a user - ValidationError - invalid data', async () => {
    const user = {
      username: 'register1@examplecom',
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
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.data).toEqual(errData);
  });

  test('POST Registers a user - AppEntitytAlreadyExistsError - username (unique field) already exists in DB', async () => {
    const user = user1;
    const errData = {
      name: 'AppEntityAlreadyExistsError',
      statusCode: 409,
      message: 'Username already exists.'
    };
    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(false);
    expect(res.body.data).toEqual(errData);
  });
});