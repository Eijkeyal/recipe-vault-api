const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const { error } = require("node:console");

router.post("/", async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const {
      cuisine,
      difficulty,
      vegetarian,
      maxTime,
      sort,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (vegetarian !== undefined) filter.isVegetarian = vegetarian === "true";
    if (maxTime) filter.prepTimeMinutes = { $lte: Number(maxTime) };
    const sortOption = sort ? sort.split(".").join(" ") : "createdAt";
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;
    const [recipes, total] = await Promise.all([
      Recipe.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Recipe.countDocuments(filter),
    ]);
    res.json({
      success: true,
      count: recipes.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    }
    res.json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    }
    res.json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, error: "Recipe not found" });
    }
    res.json({ success: true, data: {}, message: "Recipe deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
