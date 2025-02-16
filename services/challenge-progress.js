import { UserProgress } from "../models/CourseModel.js";
import { NotFoundError } from "../errors/customError.js";


export const _getUserProgress2 = async (userId) => {
    const data = await UserProgress.findOne({userId})
        .populate('activeCourseId')
        .lean();

    if(data.activeCourseId) {
        data.activeCourse = {...data.activeCourseId};
        data.activeCourseId = data.activeCourse._id;
    }

    if(!data) {
        throw new NotFoundError('user progress not found')
    }

    return data;
}




