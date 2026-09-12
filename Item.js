const mongoose = require('mongoose');

// Define the Item schema (for both Lost and Found items)
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['lost', 'found'],  // item is either lost or found
      required: true
    },
    category: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'claimed'],
      default: 'active'
    },
    imageUrl: {
      type: String,
      default: null
    },
    // Reference to the User who posted this item
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Store poster name directly so we don't need to populate every time
    postedByName: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true  // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Item', itemSchema);
