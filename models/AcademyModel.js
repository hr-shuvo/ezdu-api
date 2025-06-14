import mongoose from "mongoose";

const academyVersionTypes = ["BN", "EN"];
const academyLevelTypes = ["PRIMARY", "SECONDARY", "HIGHER_SECONDARY"];

// const AcademyLevelSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//
// })


const AcademyClassSchema = new mongoose.Schema({
    title: { type: String, required: true },
    version: { type: String, enum: academyVersionTypes, required: true, default: academyVersionTypes[0] },
    level: { type: String, enum: academyLevelTypes, ref: "AcademyLevel" },
});

const AcademySubjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    hasSubjectPaper: { type: Boolean, default: false },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyClass", index: true },
}, { timestamps: true });


const AcademyLessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    order: { type: Number },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject" },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson" },
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

const AcademyMcqSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson", required: true },
    passage: { type: String },
    question: { type: String, required: true },
    optionList: [
        {
            _id: false,
            text: { type: String, required: true },
            correct: { type: Boolean, required: true }
        }
    ],
    description: { type: String, required: false },
    createdBy: { type: String },

    // // // // question bank // // // // 

    instituteIds: [{
        _id: false,
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
        title: { type: String },
        year: { type: Number }
    }
    ],
    modelTestIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ModelTest" }],
})

AcademyMcqSchema.index({ 'instituteIds.instituteId': 1, 'instituteIds.year': 1 })



const AcademyQuizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    duration: { type: Number, required: true },
    start: { type: Date },
    end: { type: Date },

    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject" },
    lessonIds: { type: [] },
    questions: { type: [] },
    xp: { type: Number, default: 0 }
}, { timestamps: true })

const AcademyProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, default: "User" },
    userImageSrc: { type: String, required: true, default: "/mascot.svg" },
    totalXp: { type: Number, required: true, default: 0 },
    lastWeekXp: {
        type: [
            {
                _id: false,
                day: { type: Date },
                xp: { type: Number }
            }
        ],
        validate: {
            validator: function (v) {
                return v.length <= 10
            },
            message: props => `lastWeekXp exceeds the maximum of 7 days`
        }
    }
});



// const AcademyLevel = mongoose.model("AcademyLevel", AcademyLevelSchema);
const AcademyClass = mongoose.model("AcademyClass", AcademyClassSchema);
const AcademySubject = mongoose.model("AcademySubject", AcademySubjectSchema);
const AcademyLesson = mongoose.model("AcademyLesson", AcademyLessonSchema);
const LessonContent = mongoose.model('LessonContent', AcademyLessonContentSchema);
const AcademyMcq = mongoose.model('AcademyMcq', AcademyMcqSchema);
const AcademyQuiz = mongoose.model('AcademyQuiz', AcademyQuizSchema);
const AcademyProgress = mongoose.model('AcademyProgress', AcademyProgressSchema);

export {
    // AcademyLevel,
    AcademyClass,
    AcademySubject,
    AcademyLesson,
    LessonContent,
    AcademyMcq,
    AcademyQuiz,
    AcademyProgress
}