const router = require('express').Router();
const userController = require('../controllers/user.controller');
const userFavoritesController = require('../controllers/user-favorites.controller');

router.get('/:userId/favorites/', userFavoritesController.getFavoritesFilteredSortedPaginated);
router.post('/:userId/favorites/', userFavoritesController.insertFavorite);
router.get('/:userId/favorites/:favoriteId', userFavoritesController.getFavorite);
router.delete('/:userId/favorites/:favoriteId', userFavoritesController.deleteFavorite);

router.get('/', userController.getUsersFilteredSortedPaginated);
router.post('/', userController.insertUser);
router.get('/:userId', userController.getUser);
router.patch('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;