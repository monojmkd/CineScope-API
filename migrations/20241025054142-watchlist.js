module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("watchlists", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      imdbId: {
        type: Sequelize.STRING,
        references: { model: "movies", key: "imdbId" },
        onDelete: "CASCADE",
      },
      addedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("watchlists");
  },
};
