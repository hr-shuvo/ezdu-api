import { LessonContent } from "../../models/AcademyModel.js";
import { NotFoundError } from "../../errors/customError.js";

export const _loadAcademicLessonContent = async (query, page, size) => {
    try {
        const skip = (page - 1) * size;

        const result = await LessonContent.find(query).skip(skip).limit(size).lean();

        const totalCount = await LessonContent.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!result) {
            throw new NotFoundError('Lesson Content not found')
        }
        // console.log('result: ', result);
        // console.log('query: ', query);

        return {data:result, totalCount, totalPage, currentPage: page};

    } catch (error) {
        throw new Error(error.message);
    }
}