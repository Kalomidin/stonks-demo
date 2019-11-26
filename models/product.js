const mongoose = require("mongoose");

// Schema Setup
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: {
    id: String,
    url: String
  },
  description: String,
  location: String,
  // lat: Number,
  // lng: Number,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  rating: {
        type: Number,
        default: 0
    },
  votes: Number
});

module.exports = mongoose.model("Product", productSchema);
