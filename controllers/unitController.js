import { Course, Lesson, Unit } from "../models/CourseModel.js";
import { _getUserProgress } from "../services/userProgress.js";
import mongoose from "mongoose";


export const loadUnits = async (req, res) => {

    try {
        const userProgress = await _getUserProgress(req.user.userId);

        if(!userProgress?.activeCourseId) {
            return res.status(200).json({data: []});
        }

        const data = await Unit.aggregate([
            {
                $match: {courseId: userProgress.activeCourseId}
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

            // {
            //     $lookup: {
            //         from: "challengeoptions",
            //         localField: "lessons.challenges._id",
            //         foreignField: "challengeId",
            //         as: "lessons.challenges.options"
            //     }
            // },

            {
                $lookup: {
                    from: "challengeprogresses", // Ensure correct collection name
                    let: {challengeId: "$lessons.challenges._id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$challengeId", "$$challengeId"]}}},
                        {$match: {userId: new mongoose.Types.ObjectId(req.user.userId)}}
                    ],
                    as: "lessons.challenges.progress"
                }
            },
            {
                $addFields: {
                    "lessons.challenges.completed": {
                        $cond: {
                            if: {$gt: [{$size: "$lessons.challenges.progress"}, 0]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$lessons._id",
                    title: {$first: "$lessons.title"},
                    order: {$first: "$lessons.order"},
                    unitId: {$first: "$_id"},
                    unitTitle: {$first: "$title"},
                    unitOrder: {$first: "$order"},
                    challenges: {$push: "$lessons.challenges"}
                }
            },
            {
                $addFields: {
                    completed: {
                        $cond: {
                            if: {
                                $eq: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$challenges",
                                                as: "c",
                                                cond: {$eq: ["$$c.completed", true]}
                                            }
                                        }
                                    },
                                    {$size: "$challenges"}
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {$sort: {_id: 1}},
            {
                $group: {
                    _id: "$unitId",
                    title: {$first: "$unitTitle"},
                    order: {$first: "$unitOrder"},
                    lessons: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            order: "$order",
                            challenges: "$challenges",
                            completed: "$completed"
                        }
                    }
                }
            },

            {$sort: {_id: 1}}
        ]);


        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({message: "Failed to fetch courses", error: error.message});
    }

};

