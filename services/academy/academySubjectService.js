import { AcademySubject } from "../../models/AcademyModel.js";
import { NotFoundError } from "../../errors/customError.js";

export const _loadAcademicSubject = async (query, page, size, isTree) => {
    try {
        const skip = (page - 1) * size;

        const result = await AcademySubject.find(query).skip(skip).limit(size).lean();

        const totalCount = await AcademySubject.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!result) {
            throw new NotFoundError('Academic Subject not found')
        }
        // console.log('result: ', result);
        // console.log('query: ', query);

        if (!isTree) {
            return {data:result, totalCount, totalPage, currentPage: page};
        }

        const subjectList = [];
        const subjectMap = {};

        result.forEach(subject => {
            subject.children = [];
            subjectMap[subject._id.toString()] = subject;
        });

        result.forEach(subject => {
            if (subject.subjectId) {
                const parent = subjectMap[subject.subjectId.toString()];
                if (parent) {
                    parent.children.push(subject);
                }
            }
        });

        result.forEach(subject => {
            if (!subject.subjectId) {
                subjectList.push(subject);
            }
        });

        return {data:subjectList, totalCount, totalPage, currentPage: page};

    } catch (error) {
        throw new Error(error.message);
    }
}
