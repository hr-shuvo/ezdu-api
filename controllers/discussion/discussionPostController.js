import { DiscussionPost } from "../../models/BlogModel.js";

export const loadDiscussionPost = async (req, res) => {
    const {subjectId, lessonId, mine} = req.query;

    const query = {};

    if(subjectId){
        query.subjectId = subjectId;
    }
    if(lessonId){
        query.lessonId = lessonId;
    }
    if(mine === true && req.user && req.user.userId){
        query.userId = req.user.userId;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const {data, totalCount, totalPage, currentPage} = await _loadDiscussion(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modules", error: error.message });
    }
}


export const getDiscussionPost= async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).json({ message: "Invalid discussion id" });
        }

        const result = await DiscussionPost.findById(id);

        if(!result){
            return res.status(404).json({ message: "Failed to fetch discussion" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch discussion", error: error.message });
    }
}

export const upsertDiscussionPost = async (req, res) => {
    try {
        // const data = await _loadLessons();

        const model = req.body;

        if (model._id) {

            await DiscussionPost.findByIdAndUpdate(model._id, model);
            res.status(200).json('update success');
        }
        else {
            model.userId = req.user.userId;
            await DiscussionPost.create(model)
            res.status(200).json('create success');
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch discussion post", error: error.message });
    }
}












export const _loadDiscussion = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await DiscussionPost.find(query).skip(skip).limit(size)
            .sort({order: 1});

        const totalCount = await DiscussionPost.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch discussion", error: error.message });
    }
}