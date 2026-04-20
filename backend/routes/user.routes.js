const router = require('express').Router();
const userController = require('../controllers/user.controller');
const userFavoritesController = require('../controllers/user-favorites.controller');
const { verifyToken, verifyRoles } = require('../middlewares/auth.middleware');

router.get('/:userId/favorites/', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userFavoritesController.getFavoritesFilteredSortedPaginated);
router.post('/:userId/favorites/', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userFavoritesController.insertFavorite);
router.get('/:userId/favorites/:favoriteId', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userFavoritesController.getFavorite);
router.delete('/:userId/favorites/:favoriteId', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userFavoritesController.deleteFavorite);

router.get('/', verifyToken, verifyRoles('ADMIN'), userController.getUsersFilteredSortedPaginated);
router.post('/', verifyToken, verifyRoles('ADMIN'), userController.insertUser);
router.get('/:userId', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userController.getUser);
router.patch('/:userId', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userController.updateUser);
router.delete('/:userId', verifyToken, verifyRoles('ADMIN', 'EDITOR'), userController.deleteUser);

module.exports = router;