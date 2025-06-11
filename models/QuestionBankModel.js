import mongoose from "mongoose";

const instituteType = ["UNI", "BOARD", "SCHOOL"];


const InstituteSchema = new mongoose.Schema({
    title: {type: String, required:true},
    subTitle: {type: String},
    description: {type: String},
    type: { type: String, enum: instituteType, ref: "InstituteType", required:true },
})

const ModelTestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademySubject"},
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", index: true },
})





const AcademyInstitute = mongoose.model("Institute", InstituteSchema);
const AcademyModelTest = mongoose.model("ModelTest", ModelTestSchema);






export {
    AcademyInstitute,
    AcademyModelTest,
    

}