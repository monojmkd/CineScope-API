const { review, movie } = require("../models");
const { validateRatingReview } = require("../validations");
const addReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const { imdbId } = req.params;

  const error = validateRatingReview({ rating, reviewText });
  if (error.length > 0) {
    return res.json({ error });
  }

  try {
    const selectedMovie = await movie.findOne({ where: { imdbId } });
    if (!selectedMovie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    await review.create({
      rating,
      reviewText,
      imdbId,
    });

    res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Failed to add review." });
  }
};

module.exports = { addReview };
