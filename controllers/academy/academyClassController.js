import { _loadAcademicClass } from "../../services/academy/academicClassService.js";
import { StatusCodes } from "http-status-codes";
import { AcademyClass } from "../../models/AcademyModel.js";


export const loadAcademicClass = async (req, res) => {
    const {} = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if(req.query.level){
        query.level = req.query.level;
    }

    if(req.query.version){
        query.version = req.query.version;
    }

    // console.log(query);

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
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({message: "Invalid class id"});
        }

        const result = await AcademyClass.findById(id);

        if (!result) {
            return res.status(404).json({message: "Failed to fetch class"});
        }

        res.status(200).json(result);
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
