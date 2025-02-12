import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    imageSrc: {type: String, required: true}
}, {timestamps: true});

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: {type: String, required: true, default: "User"},
    userImageSrc: {type: String, required: true, default: "/mascot.svg"},
    activeCourseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
    hearts: {type: Number, required: true, default: 5},
    points: {type: Number, required: true, default: 0},
});


const Course =  mongoose.model('Course', courseSchema);
const UserProgress = mongoose.model('UserProgress', userProgressSchema);



export {
    Course,
    UserProgress
}





