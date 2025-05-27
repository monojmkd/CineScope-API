// models/wishlist.js

module.exports = (sequelize, DataTypes) => {
  const wishlist = sequelize.define(
    "wishlist",
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
  wishlist.associate = (models) => {
    wishlist.belongsTo(models.movie, { foreignKey: "imdbId" });
  };

  return wishlist;
};
