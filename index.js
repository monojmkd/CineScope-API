const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const {
  getMovies,
  addToWatchlist,
  addToWishlist,
  addToCuratedList,
  getMoviesByGenreAndActor,
  sortMovies,
  getTop5Movies,
} = require("./controllers/movieController");
const {
  createCuratedList,
  updateCuratedList,
} = require("./controllers/curatedListController");
const { addReview } = require("./controllers/reviewController");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/api/movies/search", getMovies);
app.post("/api/curated-lists", createCuratedList);
app.put("/api/curated-lists/:curatedListId", updateCuratedList);

app.post("/api/movies/watchlist", addToWatchlist);
app.post("/api/movies/wishlist", addToWishlist);
app.post("/api/movies/curated-list", addToCuratedList);

app.post("/api/movies/:imdbId/reviews", addReview);

app.get("/api/movies/searchByGenreAndActor", getMoviesByGenreAndActor);

app.get("/api/movies/sort", sortMovies);

app.get("/api/movies/top5", getTop5Movies);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Unable to connect to database", err);
  });
app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});

module.exports = app;
