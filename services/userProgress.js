import { Challenge, ChallengeOption, Lesson, Unit, UserProgress } from "../models/CourseModel.js";
import { NotFoundError } from "../errors/customError.js";
import mongoose from "mongoose";


export const _getUserProgress = async (userId) => {
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


export const _getCourseProgress = async (userId) => {
    const userProgress = await UserProgress.findOne({userId})
        .populate('activeCourseId')
        .lean();

    if(!userProgress || !userProgress.activeCourseId) {
        return null;
    }

    if(userProgress.activeCourseId) {
        userProgress.activeCourse = {...userProgress.activeCourseId};
        userProgress.activeCourseId = userProgress.activeCourse._id;
    }

    const unitsInActiveCourse = await Unit.aggregate([
        {
            $match: {courseId: new mongoose.Types.ObjectId(userProgress.activeCourseId)}
        },
        {
            $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "unitId",
                as: "lessons"
            }
        },
        {$unwind: {path: "$lessons", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "challenges",
                localField: "lessons._id",
                foreignField: "lessonId",
                as: "lessons.challenges"
            }
        },
        {$unwind: {path: "$lessons.challenges", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "challengeprogresses",
                let: {challengeId: "$lessons.challenges._id"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$challengeId", "$$challengeId"]}}},
                    {$match: {userId: new mongoose.Types.ObjectId(userId)}}
                ],
                as: "lessons.challenges.progress"
            }
        },
        {
            $group: {
                _id: "$lessons._id",
                title: {$first: "$lessons.title"},
                order: {$first: "$lessons.order"},
                challenges: {$push: "$lessons.challenges"}
            }
        },
        {
            $group: {
                _id: "$_id",
                title: {$first: "$title"},
                order: {$first: "$order"},
                lessons: {$push: "$$ROOT"}
            }
        },
        {$sort: {_id: 1}} // Sort units by order
    ]);

    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap(unit => unit.lessons)  // Flatten lessons from all units into a single array
        .find(lesson =>
            lesson.challenges.some(challenge =>
                !challenge.challengeProgress || challenge.challengeProgress.length === 0
            )
        );

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson ? firstUncompletedLesson._id : null
    };

}

export const _getLesson = async (userId, id) => {
    const courseProgress = await _getCourseProgress(userId);

    // const lessonId = id || courseProgress.activeLessonId;
    const lessonId = courseProgress.activeLessonId;

    if(!lessonId) {
        return null;
    }

    const lessons = await Lesson.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(lessonId)} // Find the specific lesson
        },
        {
            $lookup: {
                from: "challenges",
                localField: "_id",
                foreignField: "lessonId",
                as: "challenges"
            }
        },
        {$unwind: {path: "$challenges", preserveNullAndEmptyArrays: true}}, // Keep lessons with no challenges
        {
            $lookup: {
                from: "challengeprogresses",
                localField: "challenges._id",
                foreignField: "challengeId",
                as: "challenges.progress",
                pipeline: [{$match: {userId: new mongoose.Types.ObjectId(userId)}}] // Only fetch progress for user 123
            }
        },
        {
            $lookup: {
                from: "challengeoptions",
                localField: "challenges._id",
                foreignField: "challengeId",
                as: "challenges.options"
            }
        },
        {
            $group: {
                _id: "$_id",
                title: {$first: "$title"},
                order: {$first: "$order"},
                challenges: {$push: "$challenges"} // Group challenges back into an array
            }
        }
    ]);

    const data = lessons.length > 0 ? lessons[0] : null;

    if(!data || !data.challenges.length) {
        return null;
    }


    const normalizedChallenges = data.challenges.map(challenge => {
        const completed = challenge.progress &&
            challenge.progress.length > 0 &&
            challenge.progress.map(process => {
                process.completed
            });

        return {
            ...challenge,
            completed
        };
    });

    // return data;


    return {...data, challenges: normalizedChallenges};
}

