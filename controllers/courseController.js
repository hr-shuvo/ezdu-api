
import { Course } from '../models/CourseModel.js'
import { StatusCodes } from "http-status-codes";

export const loadCourses = async (req, res) =>{

    try{
        const data = await Course.find();

        res.status(200).json(data);
    }
    catch (error){
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });

    }

};
export const createCourse = async (req, res) =>{

    console.log(req.body)

    req.body.createdBy = req.user.userId;

    const course = await Course.create(req.body);

    res.status(StatusCodes.CREATED).json({course});
};


