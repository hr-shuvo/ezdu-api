import mongoose from "mongoose";

const instituteType = ["UNI", "BOARD", "SCHOOL"];
const groups = ["SCIENCE", "ARTS", "COMMERCE"]; // Only for admission


const InstituteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    logo: { type: String },
    type: { type: String, enum: instituteType, required: true },
    tags: [String],
    location: { type: String },
    website: { type: String },
}, { timestamps: true })

const ModelTestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    duration: { type: Number, default: 0 },
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject" }],
    mcqIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "AcademyMcq" }],
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

// use quiz schema
const ModelTestAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    modelTestId: { type: mongoose.Schema.Types.ObjectId, ref: "ModelTest", required: true },
    answers: [{
        mcqId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyMcq" },
        selectedOptionIndex: Number,
        correct: Boolean
    }],
    score: Number,
    xpEarned: Number,
    startedAt: Date,
    finishedAt: Date,
}, { timestamps: true });







const AcademyInstitute = mongoose.model("Institute", InstituteSchema);
const AcademyModelTest = mongoose.model("ModelTest", ModelTestSchema);






export {
    AcademyInstitute,
    AcademyModelTest,


}