const User = require('../models/user.model');
const userService = require('../services/user.service');
const httpStatusCodes = require('../utils/http-status-codes');

exports.insertUser = async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    roles: req.body.roles
  });
  const result = await userService.insertUser(user);
  console.log(`User with 'id=${result._id}' was inserted.`);
  res.status(httpStatusCodes.CREATED).json({status: true, data: result});
}

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const updates = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    roles: req.body.roles,
    isActive: req.body.isActive
  };
  const result = await userService.updateUser(userId, updates);
  console.log(`User with 'id=${userId}' was updated.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const result = await userService.deleteUser(userId);
  console.log(`User with 'id=${userId}' was deleted.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}

exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  const result = await userService.getUserById(userId);
  console.log(`User with 'id=${userId}' was returned.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}

exports.getUsersFilteredSortedPaginated = async (req, res) => {
  const { filter, sorting, pagination } = userService.generateSettings(req.query);
  const result = await userService.getUsersFilteredSortedPaginated(filter, sorting, pagination);
  console.log(`Filtered, sorted and paginated users were returned with page=${pagination.pageNumber} and size=${pagination.pageSize}.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}