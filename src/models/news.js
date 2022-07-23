const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: "Journalist",
    },
    image: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
