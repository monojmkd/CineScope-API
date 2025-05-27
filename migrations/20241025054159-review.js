module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reviews", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      imdbId: {
        type: Sequelize.STRING,
        references: { model: "movies", key: "imdbId" },
        onDelete: "CASCADE",
      },
      rating: { type: Sequelize.FLOAT },
      reviewText: { type: Sequelize.STRING },
      addedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("reviews");
  },
};
