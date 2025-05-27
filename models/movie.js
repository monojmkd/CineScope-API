// models/movie.js

module.exports = (sequelize, DataTypes) => {
  const movie = sequelize.define(
    "movie",
    {
      title: {
        type: DataTypes.STRING,
        allow: false,
      },
      imdbId: {
        type: DataTypes.STRING,
        allow: false,
        unique: true,
      },
      genre: {
        type: DataTypes.TEXT,
      },
      actors: {
        type: DataTypes.TEXT,
      },
      releaseYear: {
        type: DataTypes.INTEGER,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
    }
  );

  // Associations
  movie.associate = (models) => {
    movie.hasMany(models.review, { foreignKey: "imdbId" });
    movie.hasMany(models.watchlist, { foreignKey: "imdbId" });
    movie.hasMany(models.wishlist, { foreignKey: "imdbId" });
    movie.hasMany(models.curatedListItem, { foreignKey: "imdbId" });
  };

  return movie;
};
