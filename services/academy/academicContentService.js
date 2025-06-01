import { AcademyLesson, LessonContent } from "../../models/AcademyModel.js";
import { NotFoundError } from "../../errors/customError.js";

export const _loadAcademicLessonContent = async (query, page, size) => {
    try {
        const skip = (page - 1) * size;

        const response = await LessonContent.find(query).skip(skip).limit(size).lean().populate({
            path: 'lessonId',
            model: AcademyLesson
        });

        const result = response.map(data => {
            const { lessonId, ...rest } = data;

            return {
                ...rest,
                lesson: lessonId,
                lessonId: lessonId._id
            }
        });

        const totalCount = await LessonContent.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!result) {
            throw new NotFoundError('Lesson Content not found')
        }
        // console.log('result: ', result);
        // console.log('query: ', query);

        return { data: result, totalCount, totalPage, currentPage: page };

    } catch (error) {
        throw new Error(error.message);
    }
}