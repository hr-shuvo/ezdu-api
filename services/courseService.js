import { Course } from "../models/CourseModel.js";
import { NotFoundError } from "../errors/customError.js";


export const _loadCourses = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await Course.find(query).skip(skip).limit(size);

        const totalCount = await Course.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('Course not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        throw new Error(error.message);
        // res.status(500).json({ message: "Failed to fetch Courses", error: error.message });
    }
}