import { Module } from '../models/CourseModel.js'

export const _loadModules = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await Module.find(query).skip(skip).limit(size);

        const totalCount = await Module.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('modules not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modules", error: error.message });
    }
}