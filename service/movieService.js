const axiosInstance = require("../lib/axios.lib");
const { movie } = require("../models");
require("dotenv").config();

const searchMovieService = async (query) => {
  try {
    const response = await axiosInstance.get(process.env.OMDB_BASE_URL, {
      params: {
        t: query,
        apikey: process.env.API_KEY,
      },
    });
    const results = response.data;
    // console.log(results);
    if (!results || results.length === 0) {
      return [];
    }

    return {
      title: results.Title,
      imdbId: results.imdbID,
      genre: results.Genre,
      actors: results.Actors,
      releaseYear: results.Year,
      rating: results.imdbRating,
      description: results.Plot,
    };
  } catch (error) {
    console.error("Error fetching movie from OMDB:", error.message);
    throw new Error("Failed to fetch movie from OMDB");
  }
};
const movieExistsInDB = async (imdbId) => {
  const seletedMovie = await movie.findOne({ where: { imdbId } });
  return seletedMovie;
};
const fetchMovieAndCastDetails = async (imdbId) => {
  try {
    const response = await axiosInstance.get(process.env.OMDB_BASE_URL, {
      params: {
        i: imdbId,
        apikey: process.env.API_KEY,
      },
    });

    const data = response.data;

    if (!data || data.Response === "False") {
      throw new Error("Movie not found in OMDb");
    }

    // Extract only first 5 actors (comma-separated string)
    const actors = data.Actors
      ? data.Actors.split(",").slice(0, 5).join(", ")
      : "";

    return {
      title: data.Title,
      imdbId: data.imdbID,
      genre: data.Genre || "",
      actors: actors,
      releaseYear: parseInt(data.Year),
      rating: parseFloat(data.imdbRating) || null,
      description: data.Plot || "",
    };
  } catch (error) {
    console.error("Error in fetchMovieAndCastDetails:", error.message);
    throw new Error("Failed to fetch movie details from OMDb.");
  }
};
module.exports = {
  searchMovieService,
  fetchMovieAndCastDetails,
  movieExistsInDB,
};
