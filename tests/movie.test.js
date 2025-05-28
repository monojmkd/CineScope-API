const {
  addToWatchlist,
  addToWishlist,
  addToCuratedList,
  getMoviesByGenreAndActor,
  sortMovies,
  getTop5Movies,
} = require("../controllers/movieController");
const { movie, watchlist, wishlist, curatedListItem } = require("../models");
const axios = require("../lib/axios.lib");

// Mock the models and axios
jest.mock("../models", () => ({
  movie: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
  watchlist: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  wishlist: {
    findOrCreate: jest.fn(),
  },
  curatedListItem: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../lib/axios.lib", () => ({
  get: jest.fn(),
}));

describe("Movie Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addToWatchlist", () => {
    test("should add movie to watchlist successfully", async () => {
      const mockMovie = {
        imdbId: "tt0111161",
        title: "The Shawshank Redemption",
        genre: "Drama",
        actors: "Tim Robbins, Morgan Freeman",
        releaseYear: 1994,
        rating: 9.3,
      };

      movie.findOne.mockResolvedValue(mockMovie);
      watchlist.create.mockResolvedValue({});

      const req = { body: { imdbId: "tt0111161" } };
      const res = { json: jest.fn(), status: jest.fn(() => res) };

      await addToWatchlist(req, res);

      expect(movie.findOne).toHaveBeenCalledWith({
        where: { imdbId: "tt0111161" },
      });
      expect(watchlist.create).toHaveBeenCalledWith({ imdbId: "tt0111161" });
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie added to watchlist successfully.",
      });
    });
  });

  describe("addToWishlist", () => {
    test("should add movie to wishlist successfully", async () => {
      const mockMovie = {
        imdbId: "tt0111161",
        title: "The Shawshank Redemption",
      };

      movie.findOne.mockResolvedValue(mockMovie);
      wishlist.findOrCreate.mockResolvedValue([{}, true]);

      const req = { body: { imdbId: "tt0111161" } };
      const res = { json: jest.fn(), status: jest.fn(() => res) };

      await addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie added to wishlist successfully.",
      });
    });

    test("should return error if movie already in wishlist", async () => {
      const mockMovie = {
        imdbId: "tt0111161",
        title: "The Shawshank Redemption",
      };

      movie.findOne.mockResolvedValue(mockMovie);
      wishlist.findOrCreate.mockResolvedValue([{}, false]);

      const req = { body: { imdbId: "tt0111161" } };
      const res = { json: jest.fn(), status: jest.fn(() => res) };

      await addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie already in wishlist.",
      });
    });
  });

  describe("addToCuratedList", () => {
    test("should add movie to curated list successfully", async () => {
      const mockMovie = {
        imdbId: "tt0111161",
        title: "The Shawshank Redemption",
      };

      movie.findOne.mockResolvedValue(mockMovie);
      curatedListItem.findOne.mockResolvedValue(null);
      curatedListItem.create.mockResolvedValue({});

      const req = {
        body: {
          imdbId: "tt0111161",
          curatedListId: 1,
        },
      };
      const res = { json: jest.fn(), status: jest.fn(() => res) };

      await addToCuratedList(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Movie added to curated list successfully.",
      });
    });
  });

  describe("getMoviesByGenreAndActor", () => {
    test("should filter movies by genre and actor", async () => {
      const mockMovies = [
        {
          imdbId: "tt0111161",
          title: "The Shawshank Redemption",
          genre: "Drama",
          actors: "Tim Robbins, Morgan Freeman",
          rating: 9.3,
        },
        {
          imdbId: "tt0068646",
          title: "The Godfather",
          genre: "Crime, Drama",
          actors: "Marlon Brando, Al Pacino",
          rating: 9.2,
        },
      ];

      movie.findAll.mockResolvedValue(mockMovies);

      const req = {
        query: {
          genre: "Drama",
          actor: "Morgan",
        },
      };
      const res = { json: jest.fn(), status: jest.fn(() => res) };

      await getMoviesByGenreAndActor(req, res);

      expect(res.json).toHaveBeenCalledWith({
        movies: [
          {
            imdbId: "tt0111161",
            title: "The Shawshank Redemption",
            genre: "Drama",
            actors: "Tim Robbins, Morgan Freeman",
            rating: 9.3,
          },
        ],
      });
    });
  });

  describe("getTop5Movies", () => {
    test("should return top 5 rated movies with reviews", async () => {
      const mockMovies = [
        {
          imdbId: "tt0111161",
          title: "The Shawshank Redemption",
          rating: 9.3,
          reviews: [
            {
              reviewText: "Great movie!",
              createdAt: new Date(),
            },
          ],
        },
      ];

      movie.findAll.mockResolvedValue(mockMovies);

      const req = {};
      const res = { json: jest.fn(), status: jest.fn(() => res) };

      await getTop5Movies(req, res);

      expect(res.json).toHaveBeenCalledWith({
        movies: [
          {
            title: "The Shawshank Redemption",
            rating: 9.3,
            review: {
              text: "Great movie!",
              wordCount: 2,
            },
          },
        ],
      });
    });
  });
});
