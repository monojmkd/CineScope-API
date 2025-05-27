module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("movies", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      imdbId: { type: Sequelize.STRING, allowNull: false, unique: true },
      genre: { type: Sequelize.TEXT },
      actors: { type: Sequelize.TEXT },
      releaseYear: { type: Sequelize.INTEGER },
      rating: { type: Sequelize.FLOAT },
      description: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("movies");
  },
};
