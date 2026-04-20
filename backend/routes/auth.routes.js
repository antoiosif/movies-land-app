const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

router.post('/register', userController.insertUser);
router.post('/login', authController.login);

module.exports = router;