import { _getUserProgress } from "../services/userProgress.js";
import { Course, Lesson, Unit } from "../models/CourseModel.js";
import mongoose from "mongoose";









export const _loadUnits = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await Unit.find(query).skip(skip).limit(size);

        const totalCount = await Unit.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('units not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        throw new Error(error.message);
        res.status(500).json({ message: "Failed to fetch units", error: error.message });
    }
}










// user progress units

export const _loadUserUnits = async (userId) => {

    try {
        const userProgress = await _getUserProgress(userId);

        if(!userProgress?.activeCourseId) {
            return [];
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
                        {$match: {userId: new mongoose.Types.ObjectId(userId)}}
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
                    unitDescription: {$first: "$description"},
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
                    description: {$first: "$unitDescription"},
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


        return data;
    } catch(error) {
        throw new Error(error.message);
    }

};

