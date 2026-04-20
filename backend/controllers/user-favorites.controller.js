const userFavoritesService = require('../services/user-favorites.service');
const httpStatusCodes = require('../utils/http-status-codes');
const logger = require('../logger/logger');

exports.insertFavorite = async (req, res) => {
  const userId = req.params.userId;
  const favorite = {
    title: req.body.title,
    year: req.body.year,
    runtime: req.body.runtime,
    genre: req.body.genre,
    director: req.body.director,
    writer: req.body.writer,
    actors: req.body.actors,
    plot: req.body.plot,
    language: req.body.language,
    poster: req.body.poster,
    imdbRating: req.body.imdbRating,
    imdbId: req.body.imdbId
  };
  const result = await userFavoritesService.insertFavorite(userId, favorite);
  logger.info(`Favorite with 'id=${result.favorites.at(-1)._id}' of User with 'id=${userId}' was inserted.`);
  res.status(httpStatusCodes.CREATED).json({status: true, data: result});
}

exports.deleteFavorite = async (req, res) => {
  const { userId, favoriteId } = req.params;
  const result = await userFavoritesService.deleteFavorite(userId, favoriteId);
  logger.info(`Favorite with 'id=${favoriteId}' of User with 'id=${userId}' was deleted.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}

exports.getFavorite = async (req, res) => {
  const { userId, favoriteId } = req.params;
  const result = await userFavoritesService.getFavorite(userId, favoriteId);
  logger.debug(`Favorite with 'id=${favoriteId}' of User with 'id=${userId}' was returned.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}

exports.getFavoritesFilteredSortedPaginated = async (req, res) => {
  const userId = req.params.userId;
  const { filter, sorting, pagination } = userFavoritesService.generateSettings(req.query);
  const result = await userFavoritesService.getFavoritesFilteredSortedPaginated(userId, filter, sorting, pagination);
  logger.debug(`Filtered, sorted and paginated favorites of User with 'id=${userId}' were returned with page=${pagination.pageNumber} and size=${pagination.pageSize}.`);
  res.status(httpStatusCodes.OK).json({status: true, data: result});
}