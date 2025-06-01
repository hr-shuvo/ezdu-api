import { StatusCodes } from "http-status-codes";
import { LessonContent } from "../../models/AcademyModel.js";
import { _loadAcademicLessonContent } from "../../services/academy/academicContentService.js";

export const loadAcademicLessonContent= async (req, res) => {

    const {isTree, lessonId} = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if(lessonId) {
        query.lessonId = lessonId;
    }

    try {
        // const data = await Course.find();
        const {data, totalCount, totalPage, currentPage} = await _loadAcademicLessonContent(query, page, size, isTree);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({message: "Failed to fetch lesson", error: error.message});
    }
}


export const getAcademicLessonContent= async (req, res) => {
    try {
        const contentId = req.params.id;
        if (!contentId) {
            return res.status(400).json({message: "Invalid Content id"});
        }

        const result = await LessonContent.findById(contentId);

        if (!result) {
            return res.status(404).json({message: "Failed to fetch content"});
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch content", error: error.message});
    }
}


export const upsertAcademicLessonContent= async (req, res) => {
    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const model = req.body;

    if (model._id) {
        await LessonContent.findByIdAndUpdate(model._id, model);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await LessonContent.create(model);
        res.status(StatusCodes.CREATED).json('create success');
    }
};