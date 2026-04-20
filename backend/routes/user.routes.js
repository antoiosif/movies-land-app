const router = require('express').Router();
const userController = require('../controllers/user.controller');
const userFavoritesController = require('../controllers/user-favorites.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/:userId/favorites/', verifyToken, userFavoritesController.getFavoritesFilteredSortedPaginated);
router.post('/:userId/favorites/', verifyToken, userFavoritesController.insertFavorite);
router.get('/:userId/favorites/:favoriteId', verifyToken, userFavoritesController.getFavorite);
router.delete('/:userId/favorites/:favoriteId', verifyToken, userFavoritesController.deleteFavorite);

router.get('/', verifyToken, userController.getUsersFilteredSortedPaginated);
router.post('/', verifyToken, userController.insertUser);
router.get('/:userId', verifyToken, userController.getUser);
router.patch('/:userId', verifyToken, userController.updateUser);
router.delete('/:userId', verifyToken, userController.deleteUser);

module.exports = router;