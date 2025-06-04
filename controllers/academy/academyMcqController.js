import { AcademyMcq } from "../../models/AcademyModel.js";



export const loadAcademyMcq = async (req, res) => {
    const {subjectId, lessonId} = req.query;

    const query = {};

    if(lessonId){
        query.lessonId = lessonId;
    }
    if(subjectId){
        query.subjectId = subjectId;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const {data, totalCount, totalPage, currentPage} = await _loadAcademyMcq(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch mcq", error: error.message });
    }
}






























export const _loadAcademyMcq = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await AcademyMcq.find(query).skip(skip).limit(size);

        const totalCount = await AcademyMcq.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('mcq not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch mcq", error: error.message });
    }
}






