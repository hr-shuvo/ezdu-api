import { Module } from '../models/CourseModel.js'

export const _loadModules = async () => {
    try {
        const data = await Module.find();

        if (!data) {
            throw new NotFoundError('modules not found')
        }

        return data;

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modules", error: error.message });
    }
}