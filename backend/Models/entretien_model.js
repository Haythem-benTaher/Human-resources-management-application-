// models/entretien_model.js
const mongoose = require('mongoose');
const entretienSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    justification: {
      type: String,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date and time are required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
      required: [true, 'Status is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
  
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Entretien = mongoose.model('Entretien', entretienSchema);
module.exports = Entretien;

