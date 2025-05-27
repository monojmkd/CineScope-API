const { curatedList } = require("../models");
const { validateNewCuratedList } = require("../validations");
const createCuratedList = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const errors = validateNewCuratedList({ name, slug });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    await curatedList.create({ name, slug, description });
    return res
      .status(201)
      .json({ message: "Curated list created successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while adding curated lists." });
  }
};
const updateCuratedList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { curatedListId } = req.params;

    const list = await curatedList.findByPk(curatedListId);
    if (!list) {
      return res.status(404).json({ message: "Curated list not found." });
    }
    list.name = name || list.name;
    list.description = description || list.description;
    await list.save();
    return res
      .status(200)
      .json({ message: "Curated list updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while updating Curated list." });
  }
};

module.exports = { createCuratedList, updateCuratedList };
