import { Lesson } from "../models/CourseModel.js";
import { _loadLessons } from "../services/lessonService.js";

export const loadLessons = async (req, res) => {
    const {isActive, unitId} = req.query;

    const query = {};

    if(unitId){
        query.unitId = unitId;
    }
    if(isActive == true){
        query.status = 1;
    }
    if(isActive == false){
        query.status = 0;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const {data, totalCount, totalPage, currentPage} = await _loadLessons(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modues", error: error.message });
    }
}



export const getLesson = async (req, res) => {
    try {
        const lessonId = req.params.id;
        if(!lessonId){
            return res.status(400).json({ message: "Invalid lesson id", error: error.message });
        }

        const lesson = await Lesson.findById(lessonId);

        if(!lesson){
            return res.status(404).json({ message: "Failed to fetch lesson", error: error.message });
        }

        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch lesson", error: error.message });
    }
}
