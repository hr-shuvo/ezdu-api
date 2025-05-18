import { Challenge, ChallengeOption, Lesson, Unit, UserProgress } from "../models/CourseModel.js";
import { NotFoundError } from "../errors/customError.js";
import mongoose from "mongoose";


export const _getUserProgress = async (userId) => {
    const data = await UserProgress.findOne({userId})
        .populate('activeCourseId')
        .lean();

    if(!data) {
        throw new NotFoundError('user progress not found')
    }

    if(data.activeCourseId) {
        data.activeCourse = {...data.activeCourseId};
        data.activeCourseId = data.activeCourse._id;
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

    let  unitsInActiveCourse = await Unit.aggregate([
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
        {$sort: {order: 1}}
    ]);

    unitsInActiveCourse = await Unit.aggregate([
        {
            $match: {
                courseId: new mongoose.Types.ObjectId(userProgress.activeCourseId)
            }
        },
        {
            $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "unitId",
                as: "lessons"
            }
        },
        { $unwind: { path: "$lessons", preserveNullAndEmptyArrays: true } },
        { $sort: { "lessons.order": 1 } },

        {
            $lookup: {
                from: "challenges",
                localField: "lessons._id",
                foreignField: "lessonId",
                as: "lessons.challenges"
            }
        },
        { $unwind: { path: "$lessons.challenges", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "challengeprogresses",
                let: { challengeId: "$lessons.challenges._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$challengeId", "$$challengeId"] }
                        }
                    },
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId)
                        }
                    }
                ],
                as: "lessons.challenges.progress"
            }
        },

        // Group back challenges under each lesson
        {
            $group: {
                _id: "$lessons._id",
                lessonId: { $first: "$lessons._id" },
                lessonTitle: { $first: "$lessons.title" },
                lessonOrder: { $first: "$lessons.order" },
                unitId: { $first: "$_id" },
                unitTitle: { $first: "$title" },
                unitDescription: { $first: "$description" },
                unitOrder: { $first: "$order" },
                challenges: { $push: "$lessons.challenges" }
            }
        },
        { $sort: { lessonOrder: 1 } },

        // Group lessons under units
        {
            $group: {
                _id: "$unitId",
                title: { $first: "$unitTitle" },
                description: { $first: "$unitDescription" },
                order: { $first: "$unitOrder" },
                lessons: {
                    $push: {
                        _id: "$lessonId",
                        title: "$lessonTitle",
                        order: "$lessonOrder",
                        challenges: "$challenges"
                    }
                }
            }
        },
        { $sort: { order: 1 } }
    ]);



    // return unitsInActiveCourse;

    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap(unit => unit.lessons)
        .find(lesson =>
            lesson.challenges.some(challenge =>
                !challenge.progress || challenge.progress.length === 0
            )
        );

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson ? firstUncompletedLesson._id : null
    };

}

export const _getLesson = async (userId, id) => {
    const courseProgress = await _getCourseProgress(userId);


    const lessonId = id ?? courseProgress.activeLessonId;
    // const lessonId = courseProgress.activeLessonId;

    if(!lessonId) {
        return null;
    }

    const lessons = await Lesson.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(lessonId)}
        },
        {
            $lookup: {
                from: "challenges",
                localField: "_id",
                foreignField: "lessonId",
                as: "challenges"
            }
        },
        {$unwind: {path: "$challenges", preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "challengeprogresses",
                localField: "challenges._id",
                foreignField: "challengeId",
                as: "challenges.progress",
                pipeline: [{$match: {userId: new mongoose.Types.ObjectId(userId)}}]
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
                challenges: {$push: "$challenges"}
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
            challenge.progress.every(process => {
                return process.completed === true
            });

        return {
            ...challenge,
            completed
        };
    });

    // return data;


    return {...data, challenges: normalizedChallenges};
}

