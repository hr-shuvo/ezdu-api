import { _loadLessons } from "../services/lessonService.js";

export const loadLessons = async (req, res) => {
    const {isActive} = req.query;

    const query = {};

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