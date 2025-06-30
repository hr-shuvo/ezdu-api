import mongoose from "mongoose";

const academyVersionTypes = ["BN", "EN"];
const academyLevelTypes = ["PRIMARY", "SECONDARY", "HIGHER_SECONDARY"];
export const segmentTypes = ["JUNIOR", "SSC", "HSC", "ADMISSION", "JOB"];
export const academyGroupTypes = ['SCIENCE', 'ARTS', 'COMMERCE'];

// const AcademyLevelSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//
// })


const AcademyClassSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // unique name like: class-7, class-9-10
    title: { type: String, required: true },
    version: { type: String, enum: academyVersionTypes, required: true, default: academyVersionTypes[0] },
    level: { type: String, enum: academyLevelTypes },
    segment: { type: String, enum: segmentTypes, required: true, default: null },

    groups: [{
        _id: false,
        type: String,
        enum: academyGroupTypes,
        required: function () {
            return this.segment === 'SSC' || this.segment === 'HSC';
        }
    }],

    hasBatch: {
        type: Boolean,
        default: function () {
            return this.segment === 'SSC' || this.segment === 'HSC';
        }
    }
});

const AcademySubjectSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subTitle: { type: String },
    hasSubjectPaper: { type: Boolean, default: false },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyClass", index: true },
    groups: [{
        _id: false,
        type: String,
        enum: academyGroupTypes,
        required: function () {
            return this.segment === 'SSC' || this.segment === 'HSC';
        }
    }],
    segment: { type: String, enum: segmentTypes }
}, { timestamps: true });


const AcademyLessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    order: { type: Number },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject" },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson" },
    segment: { type: String, enum: segmentTypes }
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
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademyLesson" },
    passage: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
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
    // modelTestIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ModelTest" }],
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
    totalXp: { type: Number, required: true, default: 0, set: v => Math.round(v * 100) / 100 },
    lastStreakDay: { type: Date },
    streakCount: { type: Number },
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

const LearningPathSchema = new mongoose.Schema({
    // id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    segment: { type: String, enum: segmentTypes, required: true },
    subjects: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", required: true },
        weight: { type: Number, default: 0 }
    }],

    isPublic: { type: Boolean, default: true },

}, { timestamps: true });

// lesson progress for check how may done
//

const AdmissionCategorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    segment: { type: String, enum: segmentTypes, required: true },
    subjects: [{
        _id: false,
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", required: true },
        title: { type: String }
    }],

    pathTitle: { type: String },
    pathDescription: { type: String }
}, { timestamps: true });


const AdmissionCategoryUnitSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    segment: { type: String, enum: segmentTypes, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "AdmissionCategory" },
    subjects: [{
        _id: false,
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject", required: true },
        title: { type: String }
    }],

    pathTitle: { type: String },
    pathDescription: { type: String }
}, { timestamps: true });



// const AcademyLevel = mongoose.model("AcademyLevel", AcademyLevelSchema);
const AcademyClass = mongoose.model("AcademyClass", AcademyClassSchema);
const AcademySubject = mongoose.model("AcademySubject", AcademySubjectSchema);
const AcademyLesson = mongoose.model("AcademyLesson", AcademyLessonSchema);
const LessonContent = mongoose.model('LessonContent', AcademyLessonContentSchema);
const AcademyMcq = mongoose.model('AcademyMcq', AcademyMcqSchema);
const AcademyQuiz = mongoose.model('AcademyQuiz', AcademyQuizSchema);
const AcademyProgress = mongoose.model('AcademyProgress', AcademyProgressSchema);

const AdmissionCategory = mongoose.model('AdmissionCategory', AdmissionCategorySchema);
const AdmissionCategoryUnit = mongoose.model('AdmissionCategoryUnit', AdmissionCategoryUnitSchema);


export {
    // AcademyLevel,
    AcademyClass,
    AcademySubject,
    AcademyLesson,
    LessonContent,
    AcademyMcq,
    AcademyQuiz,
    AcademyProgress,

    AdmissionCategory,
    AdmissionCategoryUnit
}