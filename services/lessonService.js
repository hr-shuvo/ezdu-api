import { Lesson } from "../models/CourseModel.js";


export const _loadLessons = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await Lesson.find(query).skip(skip).limit(size);

        const totalCount = await Lesson.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('lessons not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modules", error: error.message });
    }
}