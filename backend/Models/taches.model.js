const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Ensure that 'User' matches the name of your User model
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidat',  // Ensure that 'User' matches the name of your User model
    },

  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task
