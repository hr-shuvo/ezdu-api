import { Course, Lesson, Unit } from "../models/CourseModel.js";
import { _getUserProgress } from "../services/userProgress.js";


export const loadUnits = async (req, res) => {

    try {
        const userProgress = await _getUserProgress(req.user.userId);

        if(!userProgress?.activeCourseId) {
            return res.status(200).json({data: []});
        }

        const data = await Unit.aggregate([
            {
                $match: { courseId: userProgress.activeCourseId }
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
                    from: "challengeoptions",
                    localField: "lessons.challenges._id",
                    foreignField: "challengeId",
                    as: "lessons.challenges.options"
                }
            },
            // ✅ Group challenges inside each lesson
            {
                $group: {
                    _id: "$lessons._id",
                    title: { $first: "$lessons.title" },
                    order: { $first: "$lessons.order" },
                    unitId: { $first: "$_id" }, // Store unitId for later grouping
                    unitTitle: { $first: "$title" }, // Store unitTitle for later grouping
                    unitOrder: { $first: "$order" }, // Store unitOrder for later grouping
                    challenges: {
                        $push: {
                            _id: "$lessons.challenges._id",
                            type: "$lessons.challenges.type",
                            question: "$lessons.challenges.question",
                            order: "$lessons.challenges.order",
                            options: "$lessons.challenges.options"
                        }
                    }
                }
            },
            // Group lessons inside each unit
            {
                $group: {
                    _id: "$unitId", // Now using unitId to group lessons under units
                    title: { $first: "$unitTitle" },
                    order: { $first: "$order" },
                    lessons: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            order: "$unitOrder",
                            challenges: "$challenges"
                        }
                    }
                }
            },

            {$sort: {_id:1}}
        ]);

        // const data = await Unit.aggregate([
        //     {$match: {courseId: userProgress.activeCourseId}},
        //     {
        //         $lookup: {
        //             from: "lessons",
        //             localField: "_id",
        //             foreignField: "unitId",
        //             as: "lessons"
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: "$lessons",
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "challenges",
        //             localField: "lessons._id",
        //             foreignField: "lessonId",
        //             as: "lessons.challenges"
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: "$lessons.challenges",
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "challengeoptions",
        //             localField: "lessons.challenges._id",
        //             foreignField: "challengeId",
        //             as: "lessons.challenges.options"
        //         }
        //     },
        //
        //
        //     {
        //         $lookup:{
        //             from: "challengeprogresses",
        //             let: {challengeId: "$lessons.challenges._id"},
        //             pipeline:[
        //                 {
        //                     $match:{
        //                         $expr: {$eq: ["$challengeId", "$$challengeId"]},
        //                         userId: req.user.userId
        //                     }
        //                 }
        //             ],
        //             as: "lessons.challenges.progress"
        //         }
        //
        //     },
        //
        //
        //     {
        //         $group: {
        //             _id: "$lessons._id",
        //             title: { $first: "$lessons.title" },
        //             order: { $first: "$lessons.order" },
        //             challenges: { $push: "$lessons.challenges" }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$_id",
        //             title: { $first: "$title" },
        //             order: { $first: "$order" },
        //             lessons: { $push: {
        //                     _id: "$_id",
        //                     title: "$title",
        //                     order: "$order",
        //                     challenges: "$challenges"
        //                 }}
        //         }
        //     },
        //     {
        //         $sort: {_id:1}
        //     },
        // ]);


        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({message: "Failed to fetch courses", error: error.message});
    }

};

// export const loadUnits = async (req, res) => {
//
//     try {
//         const userProgress = await _getUserProgress(req.user.userId);
//
//         if(!userProgress?.activeCourseId) {
//             return res.status(200).json({data: []});
//         }
//
//         const units = await Unit.find({courseId: userProgress.activeCourseId}) ?? [];
//
//         if(units?.length){
//             const lessons = [];
//             for(const unit of units){
//                 const _lessons = await Lesson.find({unitId: unit._id});
//                 lessons.push(lessons);
//                 console.error('--------->', _lessons)
//
//
//
//
//
//
//             }
//
//             for(let i = 0; i < units.length; i++){
//                 units[i].lessons = lessons[i];
//
//             }
//
//
//         }
//
//
//
//
//
//         res.status(200).json(units);
//     } catch(error) {
//         res.status(500).json({message: "Failed to fetch courses", error: error.message});
//     }
//
// };