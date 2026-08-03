const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    cuisine: {
      type: String,
      enum: {
        values: [
          "italian",
          "mexican",
          "indian",
          "chinese",
          "american",
          "other",
        ],
        message: "{VALUE} is not a supported cuisine",
      },
      default: "other",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    prepTimeMinutes: {
      type: Number,
      required: [true, "Preparation time is required"],
      min: [1, "Prep time must be at least 1 minute"],
      max: [600, "Prep time cannot exceed 600 minutes"],
    },

    servings: {
      type: Number,
      required: [true, "Servings are required"],
      min: [1, "Servings must be at least 1"],
    },

    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "A recipe must have at least one ingredient",
      },
    },

    steps: {
      type: [String],
      default: [],
    },

    isVegetarian: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be greater than 5"],
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.every((tag) => /^[a-z0-9-]+$/.test(tag));
        },
        message:
          "Tags must be lowercase and contain only letters, numbers, or hyphens",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
    },
  },
  {
    timestamps: true,
  },
);

recipeSchema.virtual("totalTimeLabel").get(function () {
  return `${this.prepTimeMinutes} min`;
});

recipeSchema.set("toJSON", { virtuals: true });
recipeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Recipe", recipeSchema);
