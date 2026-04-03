const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsersFilteredSortedPaginated);
router.post('/', userController.insertUser);
router.get('/:userId', userController.getUser);
router.patch('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;