import { StatusCodes } from "http-status-codes";
import { _loadAcademicSubject } from "../../services/academy/academySubjectService.js";
import { AcademySubject } from "../../models/AcademyModel.js";

export const loadAcademicSubject = async (req, res) => {

    const {isTree} = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    try {
        // const data = await Course.find();
        const {data, totalCount, totalPage, currentPage} = await _loadAcademicSubject(query, page, size, isTree);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({message: "Failed to fetch courses", error: error.message});
    }
}


export const getAcademicSubject = async (req, res) => {
    try {
        const subjectId = req.params.id;
        if (!subjectId) {
            return res.status(400).json({message: "Invalid course id"});
        }

        const result = await AcademySubject.findById(subjectId);

        if (!result) {
            return res.status(404).json({message: "Failed to fetch class"});
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch class", error: error.message});
    }
}


export const upsertAcademicSubject = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const model = req.body;

    if (model._id) {
        await AcademySubject.findByIdAndUpdate(model._id, model);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AcademySubject.create(model)
        res.status(StatusCodes.CREATED).json('create success');
    }
};
