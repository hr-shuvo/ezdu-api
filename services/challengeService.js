import { Challenge } from "../models/CourseModel.js";


export const _loadChallenges = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await Challenge.find(query).skip(skip).limit(size);

        const totalCount = await Challenge.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('challenges not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
    }
}