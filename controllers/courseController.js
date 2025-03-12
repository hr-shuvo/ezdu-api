
import { Course } from '../models/CourseModel.js'
import { StatusCodes } from "http-status-codes";
import { _loadCourses } from '../services/courseService.js';

export const loadCourses = async (req, res) =>{

    const {isActive, moduleId} = req.query;

    const query = {};

    if(moduleId){
        query.moduleId = moduleId;
    }
    if(isActive == true){
        query.status = 1;
    }
    if(isActive == false){
        query.status = 0;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try{
        // const data = await Course.find();
        const {data, totalCount, totalPage, currentPage} = await _loadCourses(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    }
    catch (error){
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });

    }

};


export const getCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        if(!courseId){
            return res.status(400).json({ message: "Invalid course id", error: error.message });
        }

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({ message: "Failed to fetch course", error: error.message });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modues", error: error.message });
    }
}



export const createCourse = async (req, res) =>{

    console.log(req.body)

    req.body.createdBy = req.user.userId;

    const course = req.body;

    if (course._id) {
        await Course.findByIdAndUpdate(course._id, course);
        res.status(200).json('update success');
    }
    else {
        await Course.create(course)
        res.status(200).json('create success');
    }

    // const course = await Course.create(req.body);

    res.status(StatusCodes.CREATED).json({course});
};


