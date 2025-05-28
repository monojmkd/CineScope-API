// models/review.js

module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define(
    "review",
    {
      imdbId: {
        type: DataTypes.STRING,
        references: { model: "movie", key: "imdbId" },
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      reviewText: {
        type: DataTypes.STRING,
      },
      addedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
    }
  );

  // Associations
  review.associate = (models) => {
    review.belongsTo(models.movie, {
      foreignKey: "imdbId",
      targetKey: "imdbId",
    });
  };

  return review;
};
