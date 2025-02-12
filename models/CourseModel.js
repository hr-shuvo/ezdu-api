import mongoose from "mongoose";

const challengeTypes = ["SELECT", "ASSIST"];

const moduleSchema = new mongoose.Schema({
    title: {type: String, required: true}
})

const courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    imageSrc: {type: String, required: true, default: '/globe.svg'},
    moduleId: {type: mongoose.Schema.Types.ObjectId, ref: "Module"}
}, {timestamps: true});

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: {type: String, required: true, default: "User"},
    userImageSrc: {type: String, required: true, default: "/mascot.svg"},
    activeCourseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
    hearts: {type: Number, required: true, default: 5},
    points: {type: Number, required: true, default: 0},
});

const unitSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true},
    order: {type: Number, required: true, default: 1},
});

const lessonSchema = new mongoose.Schema({
    title: {type: String, required: true},
    unitId: {type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true},
    order: {type: Number, required: true},
});

const challengeSchema = new mongoose.Schema({
    lessonId: {type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true},
    type: {type: String, enum: challengeTypes, required: true},
    question: {type: String, required: true},
    order: {type: Number, required: true},
});

const challengeOptionSchema = new mongoose.Schema({
    challengeId: {type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true},
    text: {type: String, required: true},
    correct: {type: Boolean, required: true},
    imageSrc: {type: String},
    audioSrc: {type: String},
});



const Module =  mongoose.model('Module', moduleSchema);
const Course =  mongoose.model('Course', courseSchema);
const UserProgress = mongoose.model('UserProgress', userProgressSchema);
const Unit = mongoose.model("Unit", unitSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);
const ChallengeOption = mongoose.model("ChallengeOption", challengeOptionSchema);


export {
    Module,
    Course,
    UserProgress,
    Unit,
    Lesson,
    Challenge,
    ChallengeOption
}





