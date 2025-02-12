import { Course, Unit } from "../models/CourseModel.js";
import { _getUserProgress } from "../services/userProgress.js";


export const loadUnits = async (req, res) => {

    try {
        const userProgress = await _getUserProgress(req.user.userId);

        if(!userProgress?.activeCourseId) {
            return res.status(200).json({data: []});
        }

        const data = await Unit.aggregate([
            {$match: {courseId: userProgress.activeCourseId}},
            {
                $lookup:{
                    from: 'lessons',
                    localField: '_id',
                    foreignField: 'unitId',
                    as: 'lessons'
                }
            },
            {$unwind : {path: '$lessons', preserveNullAndEmptyArrays: true}},
            {
                $lookup:{
                    from: 'challenges',
                    localField: 'lessons._id',
                    foreignField: 'lessonId',
                    as: 'lessons.challenges'
                }
            },

            {$unwind : {path: '$lessons.challenges', preserveNullAndEmptyArrays: true}},
            {
                $lookup:{
                    from: 'challengeoptions',
                    localField: 'lessons.challenges._id',
                    foreignField: 'challengeId',
                    as: 'lessons.challenges.options'
                }
            },

            {
                $lookup: {
                    from: "challengeprogresses",
                    let: { challengeId: "$lessons.challenges._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$challengeId", "$$challengeId"] },
                                userId: req.user.userId
                            }
                        }
                    ],
                    as: "lessons.challenges.progress",
                },
            },

            // {
            //     $addFields: {
            //         "lessons.challenges.progress": {
            //             $ifNull: [
            //                 { $arrayElemAt: ["$lessons.challenges.progress", 0] },
            //                 {
            //                     userId: req.user.userId,
            //                     challengeId: "$lessons.challenges._id",
            //                     completed: false
            //                 }
            //             ]
            //         },
            //     },
            // },


            // group lessons back together
            {
                $group: {
                    _id: "$lessons._id",
                    title: { $first: "$lessons.title" },
                    order: { $first: "$lessons.order" },
                    challenges: {
                        $push: {
                            question: "$lessons.challenges.question",
                            options: "$lessons.challenges.options",
                            progress: "$lessons.challenges.progress"
                        }
                    }
                }
            },

            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    order: { $first: "$order" },
                    lessons: { $push: { title: "$title", challenge: "$challenges" } }
                }
            }



        ])


        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({message: "Failed to fetch courses", error: error.message});
    }

};