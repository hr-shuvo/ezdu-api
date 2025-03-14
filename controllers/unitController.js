import { _loadUserUnits, _loadUnits } from "../services/unitService.js";
import { _getUserProgress } from "../services/userProgress.js";




export const loadUnits = async (req, res) => {
    const { isActive, courseId } = req.query;

    const query = {};

    if (isActive == true) {
        query.status = 1;
    }
    if (isActive == false) {
        query.status = 0;
    }

    if(courseId){
        query.courseId = courseId;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const { data, totalCount, totalPage, currentPage } = await _loadUnits(query, page, size);

        res.status(200).json({ data, totalCount, totalPage, currentPage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch units", error: error.message });
    }
}














export const loadUserUnits = async (req, res) => {

    try {
        const data = await _loadUserUnits(req.user.userId);


        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }

};

