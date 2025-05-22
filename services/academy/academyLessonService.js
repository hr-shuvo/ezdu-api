import { NotFoundError } from "../../errors/customError.js";
import { AcademyLesson } from "../../models/AcademyModel.js";

export const _loadAcademicLesson = async (query, page, size, isTree) => {
    try {
        const skip = (page - 1) * size;

        const result = await AcademyLesson.find(query).skip(skip).limit(size).lean();

        const totalCount = await AcademyLesson.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!result) {
            throw new NotFoundError('Academic lesson not found')
        }
        // console.log('result: ', result);
        // console.log('query: ', query);

        if (!isTree) {
            return {data:result, totalCount, totalPage, currentPage: page};
        }

        const lessonList = [];
        const lessonMap = {};

        result.forEach(lesson => {
            lesson.children = [];
            lessonMap[lesson._id.toString()] = lesson;
        });

        result.forEach(lesson => {
            if (lesson.lessonId) {
                const parent = lessonMap[lesson.lessonId.toString()];
                if (parent) {
                    parent.children.push(lesson);
                }
            }
        });

        result.forEach(lesson => {
            if (!lesson.lessonId) {
                lessonList.push(lesson);
            }
        });

        return {data:lessonList, totalCount, totalPage, currentPage: page};

    } catch (error) {
        throw new Error(error.message);
    }
}