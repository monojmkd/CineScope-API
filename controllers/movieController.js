const axiosInstance = require("../lib/axios.lib");
const {
  searchMovieService,
  movieExistsInDB,
  fetchMovieAndCastDetails,
} = require("../service/movieService");
const {
  validateMovieSearchQuery,
  validateGenreAndActor,
} = require("../validations/index");
const { movie, watchlist, wishlist, curatedListItem } = require("../models");
const getMovies = async (req, res) => {
  const errors = validateMovieSearchQuery(req.query);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const { query } = req.query;
    const movie = await searchMovieService(query);
    if (movie.length === 0) {
      return res
        .status(404)
        .json({ message: "No movie found for this query." });
    }
    res.status(200).json({ movie });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie from OMDB" });
  }
};
const saveMovieIfNotExists = async (imdbId) => {
  const selectedMovie = await movieExistsInDB(imdbId);
  if (selectedMovie) return selectedMovie;

  const movieData = await fetchMovieAndCastDetails(imdbId);
  return await movie.create(movieData);
};
const addToWatchlist = async (req, res) => {
  const { imdbId } = req.body;
  try {
    const selectedMovie = await saveMovieIfNotExists(imdbId);
    await watchlist.create({ imdbId: selectedMovie.imdbId });
    res.json({ message: "Movie added to watchlist successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addToWishlist = async (req, res) => {
  try {
    const { imdbId } = req.body;

    if (!imdbId) {
      return res.status(400).json({ error: "IMDb ID is required." });
    }

    let selectedMovie = await movie.findOne({ where: { imdbId } });

    if (!selectedMovie) {
      const movieData = await fetchMovieAndCastDetails(imdbId);
      selectedMovie = await movie.create(movieData);
    }

    const [wishlistEntry, created] = await wishlist.findOrCreate({
      where: { imdbId: selectedMovie.imdbId },
    });

    if (!created) {
      return res.status(400).json({ message: "Movie already in wishlist." });
    }

    res.status(201).json({ message: "Movie added to wishlist successfully." });
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
const addToCuratedList = async (req, res) => {
  try {
    const { imdbId, curatedListId } = req.body;

    if (!imdbId || !curatedListId) {
      return res
        .status(400)
        .json({ error: "IMDb ID and CuratedList ID are required." });
    }

    let selectedMovie = await movie.findOne({ where: { imdbId } });

    if (!selectedMovie) {
      const movieData = await fetchMovieAndCastDetails(imdbId);
      selectedMovie = await movie.create(movieData);
    }

    const existingEntry = await curatedListItem.findOne({
      where: { imdbId: selectedMovie.imdbId, curatedListId },
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "Movie already exists in curated list." });
    }

    await curatedListItem.create({
      imdbId: selectedMovie.imdbId,
      curatedListId,
    });

    res
      .status(201)
      .json({ message: "Movie added to curated list successfully." });
  } catch (error) {
    console.error("Error adding to curated list:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
const getMoviesByGenreAndActor = async (req, res) => {
  const { genre, actor } = req.query;
  const errors = validateGenreAndActor({ genre, actor });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const allMovies = await movie.findAll();

    const filteredMovies = allMovies.filter((movie) => {
      const genreMatch = genre
        ? movie.genre?.toLowerCase().includes(genre.toLowerCase())
        : true;
      const actorMatch = actor
        ? movie.actors?.toLowerCase().includes(actor.toLowerCase())
        : true;
      return genreMatch && actorMatch;
    });

    res.status(200).json({ movies: filteredMovies });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
};
const sortMovies = async (req, res) => {
  const { list, sortBy, order = "ASC" } = req.query;

  const validLists = {
    watchlist: watchlist,
    wishlist: wishlist,
    curatedlist: curatedListItem,
  };

  const validSortFields = ["rating", "releaseYear"];

  if (!validLists[list]) {
    return res.status(400).json({ error: "Invalid list type" });
  }

  if (!validSortFields.includes(sortBy)) {
    return res.status(400).json({ error: "Invalid sortBy field" });
  }

  try {
    // Step 1: Get all imdbIds from the selected list
    const ListModel = validLists[list];
    const listItems = await ListModel.findAll({ attributes: ["imdbId"] });

    const imdbIds = listItems.map((item) => item.imdbId);

    // Step 2: Fetch sorted movies from Movies table
    const movies = await movie.findAll({
      where: { imdbId: imdbIds },
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json({ movies });
  } catch (error) {
    console.error("Error sorting movies:", error.message);
    res.status(500).json({ error: "Failed to sort movies" });
  }
};
module.exports = {
  getMovies,
  addToWatchlist,
  addToWishlist,
  addToCuratedList,
  getMoviesByGenreAndActor,
  sortMovies,
};
