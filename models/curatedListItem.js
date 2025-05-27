// models/curatedListItem.js

module.exports = (sequelize, DataTypes) => {
  const curatedListItem = sequelize.define(
    "curatedListItem",
    {
      curatedListId: {
        type: DataTypes.INTEGER,
        references: { model: "curatedList", key: "id" },
      },
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
  curatedListItem.associate = (models) => {
    curatedListItem.belongsTo(models.curatedList, {
      foreignKey: "curatedListId",
    });
    curatedListItem.belongsTo(models.movie, { foreignKey: "imdbId" });
  };

  return curatedListItem;
};
