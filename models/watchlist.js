// models/watchlist.js

module.exports = (sequelize, DataTypes) => {
  const watchlist = sequelize.define(
    "watchlist",
    {
      imdbId: {
        type: DataTypes.STRING,
        references: { model: "movie", key: "imdbId" },
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
  watchlist.associate = (models) => {
    watchlist.belongsTo(models.movie, { foreignKey: "imdbId" });
  };

  return watchlist;
};
