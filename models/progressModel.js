// File: api/models/progressModel.js
// Description: This file defines the Mongoose schema and model for tracking user progress in a learning application.

import mongoose from "mongoose";

// similar as challenge progress
// but for learning progress
const LearningProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson", required: true },
  lessonsCompleted: { type: Number, default: 0 },
  lessonContents:[
    {
      _id: false,
      contentId: { type: mongoose.Schema.Types.ObjectId, ref: "LessonContent" },
      completed: { type: Boolean, default: false }
    }
  ],
  lastAccessed: { type: Date, default: Date.now }
});

const LearningProgress = mongoose.model("LearningProgress", LearningProgressSchema);

export {
    LearningProgress
}
