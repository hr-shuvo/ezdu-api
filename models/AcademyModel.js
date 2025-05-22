import mongoose from "mongoose";

const academyVersionTypes = ["BN", "EN"];
const academyLevelTypes = ["PRIMARY", "SECONDARY", "HIGHER_SECONDARY"];

// const AcademyLevelSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//
// })


const AcademyClassSchema = new mongoose.Schema({
    title: {type: String, required: true},
    version: {type: String, enum:academyVersionTypes, required: true, default: academyVersionTypes[0]},
    level: {type:String,  enum: academyLevelTypes, ref: "AcademyLevel"},
});

const AcademySubjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String},
    hasSubjectPaper: {type: Boolean, default: false},
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyClass", index: true },

});


const AcademyLessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    order: { type: Number },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject"},
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson"},
})
const AcademyLessonContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    content: { type: String },
    description: { type: String },
    text1: { type: String },
    text2: { type: String },
    text3: { type: String },
    text4: { type: String },
    text5: { type: String },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson" },
})




// const AcademyLevel = mongoose.model("AcademyLevel", AcademyLevelSchema);
const AcademyClass = mongoose.model("AcademyClass", AcademyClassSchema);
const AcademySubject = mongoose.model("AcademySubject", AcademySubjectSchema);
const AcademyLesson = mongoose.model("AcademyLesson", AcademyLessonSchema);
const LessonContent = mongoose.model('LessonContent', AcademyLessonContentSchema);

export {
    // AcademyLevel,
    AcademyClass,
    AcademySubject,
    AcademyLesson,
    LessonContent,
}