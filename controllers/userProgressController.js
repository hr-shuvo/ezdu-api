import { UserProgress } from "../models/CourseModel.js";
import { StatusCodes } from "http-status-codes";
import { _getCourseProgress, _getLesson, _getUserProgress } from "../services/userProgress.js";


export const getUserProgress = async (req, res) => {

    const data = await _getUserProgress(req.user.userId);

    res.status(StatusCodes.OK).json(data);
};

export const getCourseProgress = async (req, res) => {

    const data = await _getCourseProgress(req.user.userId);

    res.status(StatusCodes.OK).json(data);
};

export const getLesson = async (req, res) => {

    const data = await _getLesson(req.user.userId, req.query.id);

    res.status(StatusCodes.OK).json(data);
};


export const getLessonPercentage = async (req, res) =>{

    console.log('loading course progress...')
    const courseProgress = await _getCourseProgress(req.user.userId);

    const data = 0;
    if(!courseProgress || !courseProgress.activeLessonId){
        return res.status(StatusCodes.OK).json(data);
    }

    const lessonId = courseProgress.activeLessonId;

    const lesson = await _getLesson(req.user.userId, lessonId.toString());

    if(!lesson)
    {
        return res.status(StatusCodes.OK).json(data);
    }

    const completedChallenges = lesson.challenges.filter(challenge => challenge.completed);

    const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);

    return res.status(StatusCodes.OK).json({data: percentage});
}



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