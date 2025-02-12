import { UserProgress } from "../models/CourseModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";


export const getUserProgress = async (req, res) => {
    const data = await UserProgress.findOne({userId: req.user.userId})
        .populate('activeCourseId')
        .lean();

    if(data.activeCourseId){
        data.activeCourse = {...data.activeCourseId};
        data.activeCourseId = data.activeCourse._id;
    }

    // console.log(data);

    if(!data) {
        throw new NotFoundError('user progress not found')
    }

    res.status(StatusCodes.OK).json(data);
};

export const selectUserCourse = async (req, res) => {

    try {
        const userId = req.user.userId;
        const {courseId} = req.body;

        if(!courseId) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid Course'})
        }

        const existingUserProgress = await UserProgress.findOne({userId});
        if(existingUserProgress) {
            await UserProgress.updateOne({userId}, {
                $set: {
                    activeCourseId: courseId,
                    userName: 'User 2',
                    userImageSrc: '/mascot.svg'
                }
            })

            return res.status(StatusCodes.OK).json({message: 'course updated successful'});

        } else {
            await UserProgress.create({
                userId,
                activeCourseId: courseId,
                userName: 'User 1',
                userImageSrc: '/mascot.svg',
            });

            return res.status(StatusCodes.OK).json({message: 'course select successful'})
        }

    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Failed to fetch user progress, api"});
    }
};