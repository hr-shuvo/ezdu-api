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

    // console.log(subjectId);
    // console.log(lessonId);

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const {data, totalCount, totalPage, currentPage} = await _loadAcademyMcq(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch mcq", error: error.message });
    }
}


export const getAcademyMcq = async (req, res) => {
    try {
        const mcqId = req.params.id;
        if(!mcqId){
            return res.status(400).json({ message: "Invalid mcq id", error: error.message });
        }

        const mcq = await AcademyMcq.findById(mcqId);

        if(!mcq){
            return res.status(404).json({ message: "Failed to fetch mcq", error: error.message });
        }

        res.status(200).json(mcq);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}


export const upsertAcademyMcq = async (req, res) => {
    try {
        // const data = await _loadModules();

        const mcq = req.body;

        if (mcq._id) {
            await AcademyMcq.findByIdAndUpdate(mcq._id, mcq);
            res.status(200).json('update success');
        }
        else {
            await AcademyMcq.create(mcq)
            res.status(200).json('create success');
        }


    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
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






