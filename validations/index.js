function validateMovieSearchQuery(movie) {
  const errors = [];
  if (!movie) {
    errors.push("Valid movie must be provided.");
  }
  return errors;
}

function validateNewCuratedList({ name, slug }) {
  const errors = [];
  if (!name || !slug) {
    errors.push("Name and Slug are required");
  }
  return errors;
}

function validateRatingReview({ rating, reviewText }) {
  const errors = [];
  if (typeof rating !== "number" || rating < 0 || rating > 10) {
    errors.push("Rating must be between 0 and 10.");
  }

  if (!reviewText || reviewText.length > 500) {
    errors.push("Review text must be under 500 characters.");
  }
  return errors;
}
function validateGenreAndActor({ genre, actor }) {
  const errors = [];
  if (!genre && !actor) {
    errors.push("At least one of 'genre' or 'actor' is required.");
  }
  return errors;
}
module.exports = {
  validateMovieSearchQuery,
  validateNewCuratedList,
  validateRatingReview,
  validateGenreAndActor,
};
