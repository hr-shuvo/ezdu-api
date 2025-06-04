import { AcademyLesson } from "../../models/AcademyModel.js";
import { StatusCodes } from "http-status-codes";
import { _loadAcademicLesson } from "../../services/academy/academyLessonService.js";

export const loadAcademicLesson = async (req, res) => {

    const {isTree, subjectId} = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if(subjectId) {
        query.subjectId = subjectId;
    }

    try {
        // const data = await Course.find();
        const {data, totalCount, totalPage, currentPage} = await _loadAcademicLesson(query, page, size, isTree);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({message: "Failed to fetch lesson", error: error.message});
    }
}


export const getAcademicLesson = async (req, res) => {
    try {
        const lessonId = req.params.id;
        if (!lessonId) {
            return res.status(400).json({message: "Invalid lesson id"});
        }

        const result = await AcademyLesson.findById(lessonId);

        if (!result) {
            return res.status(404).json({message: "Failed to fetch lesson"});
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch lesson", error: error.message});
    }
}


export const upsertAcademicLesson = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const model = req.body;

    if (model._id) {
        await AcademyLesson.findByIdAndUpdate(model._id, model);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AcademyLesson.create(model)
        res.status(StatusCodes.CREATED).json('create success');
    }
};