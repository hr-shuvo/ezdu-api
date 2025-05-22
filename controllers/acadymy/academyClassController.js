import { _loadAcademicClass } from "../../services/academy/academicClassService.js";
import { Course } from "../../models/CourseModel.js";
import { StatusCodes } from "http-status-codes";
import { AcademyClass } from "../../models/AcademyModel.js";


export const loadAcademicClass = async (req, res) => {

    const query = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;


    try {
        // const data = await Course.find();
        const {data, totalCount, totalPage, currentPage} = await _loadAcademicClass(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({message: "Failed to fetch courses", error: error.message});

    }
}


export const getAcademicClass = async (req, res) => {
    try {
        const classId = req.params.id;
        if (!classId) {
            return res.status(400).json({message: "Invalid course id"});
        }

        const academicClass = await Course.findById(classId);

        if (!academicClass) {
            return res.status(404).json({message: "Failed to fetch class"});
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch class", error: error.message});
    }
}


export const upsertAcademicClass = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const academicClass = req.body;

    if (academicClass._id) {
        await AcademyClass.findByIdAndUpdate(academicClass._id, academicClass);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AcademyClass.create(academicClass)
        res.status(StatusCodes.CREATED).json('create success');
    }
};
