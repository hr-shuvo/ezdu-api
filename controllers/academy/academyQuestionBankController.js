import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AcademyInstitute, AcademyModelTest } from "../../models/QuestionBankModel.js";
import { AcademyMcq } from "../../models/AcademyModel.js"

export const loadAcademicInstitute = async (req, res) => {
    const { type } = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if (type) {
        query.type = type;
    }

    try {
        // const data = await Course.find();
        const { data, totalCount, totalPage, currentPage } = await _loadAcademicInstitute(query, page, size);

        res.status(200).json({ data, totalCount, totalPage, currentPage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch institute", error: error.message });
    }
}


export const getAcademicInstitute = async (req, res) => {
    try {
        const instituteId = req.params.id;
        if (!instituteId) {
            return res.status(400).json({ message: "Invalid institute id" });
        }

        const result = await AcademyInstitute.findById(instituteId);

        if (!result) {
            return res.status(404).json({ message: "Not found institute" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch institute", error: error.message });
    }
}


export const upsertAcademicInstitute = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const model = req.body;

    if (model._id) {
        await AcademyInstitute.findByIdAndUpdate(model._id, model);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AcademyInstitute.create(model)
        res.status(StatusCodes.CREATED).json('create success');
    }
};



// // // Model Test // // // 

// reutrn institute by subject
export const loadAcademicSubjectModelTest = async (req, res) => {
    const { subjectId } = req.query;

    if (!subjectId) {
        return res.status(400).json({ data: null, message: "No subject found" });
    }

    const results = await AcademyMcq.aggregate([
        {
            $match: {
                subjectId: new mongoose.Types.ObjectId(subjectId)
            }
        },
        {
            $unwind: "$instituteIds"
        },
        {
            $group: {
                _id: {
                    instituteId: "$instituteIds.instituteId",
                    title: "$instituteIds.title",
                    year: "$instituteIds.year"
                },
                mcqCount: { $sum: 1 },
                // mcqlist: {
                //     $push: {
                //         _id: "$_id",
                //         question: "$question",
                //         passage: "$passage",
                //         optionList: "$optionList",
                //         description: "$description",
                //         lessonId: "$lessonId"
                //     }
                // }
            }
        },
        {
            $project: {
                _id: 0,
                instituteId: "$_id.instituteId",
                title: "$_id.title",
                year: "$_id.year",
                mcqlist: 1,
                mcqCount: "$mcqCount"
            }
        }
    ]);

    return res.status(200).json({ data: results });
}



export const loadMcqsBySubjectAndInstitute = async (req, res) => {
    const { subjectId, instituteId } = req.query;

    if (!subjectId || !instituteId) {
        return res.status(400).json({ error: 'subjectId and instituteId are required' });
    }

    try {

        const {
            subjectId,
            instituteId,
        } = req.query;

        const page = Number(req.query.pg) || 1;
        const size = Number(req.query.sz) || 10;

        if (!subjectId || !instituteId) {
            return res.status(400).json({ error: 'subjectId and instituteId are required' });
        }

        const skip = (parseInt(page) - 1) * parseInt(size);

        const query = {
            subjectId,
            instituteIds: {
                $elemMatch: { instituteId }
            }
        };

        const total = await AcademyMcq.countDocuments(query);

        const mcqs = await AcademyMcq.find(query)
            .skip(skip)
            .limit(parseInt(size))
            .populate('subjectId')
            .lean();

        const formatted = mcqs.map(mcq => {
            const match = mcq.instituteIds.find(i =>
                i.instituteId?.toString() === instituteId
            );

            return {
                ...mcq,
                subject: mcq.subjectId,
                subjectId: mcq.subjectId?._id || mcq.subjectId,
                instituteName: match?.title,
                year: match?.year || null
            };
        });

        res.status(200).json({
            totalCount: total,
            currentPage: parseInt(page),
            totalPage: Math.ceil(total / size),
            data: formatted
        });


    } catch (error) {
        console.error('Error fetching MCQs:', error);
        res.status(500).json({ error: 'Server error fetching MCQs' });
    }
};
















export const loadAcademicModelTest = async (req, res) => {
    const { instituteId, subjectId, year } = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if (instituteId) {
        query.instituteId = instituteId;
    }
    if (subjectId) {
        query.subjectId = subjectId;
    }
    if (year) {
        query.year = year;
    }

    try {
        // const data = await Course.find();
        const { data, totalCount, totalPage, currentPage } = await _loadAcademicModelTest(query, page, size);
        // console.log('model test: ', data)
        res.status(200).json({ data, totalCount, totalPage, currentPage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch model test", error: error.message });
    }
}


export const getAcademicModelTest = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Invalid model test id" });
        }

        const response = await AcademyModelTest.findById(id)
            .populate('instituteId')
            .populate('subjectId')
            .lean()
            ;

        const result = {
            ...response,
            institute: response.instituteId,
            instituteId: response.instituteId?._id,
            subject: response.subjectId,
            subjectId: response.subjectId?._id
        }


        // console.log(response)
        if (!result) {
            return res.status(404).json({ message: "Not model test" });
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch model test", error: error.message });
    }
}


export const upsertAcademicModelTest = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const model = req.body;

    if (model._id) {
        await AcademyModelTest.findByIdAndUpdate(model._id, model);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AcademyModelTest.create(model)
        res.status(StatusCodes.CREATED).json('create success');
    }
};












export const _loadAcademicInstitute = async (query, page, size) => {
    try {
        const skip = (page - 1) * size;

        const result = await AcademyInstitute.find(query).skip(skip).limit(size);

        const totalCount = await AcademyInstitute.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!result) {
            throw new NotFoundError('Institute not found')
        }
        // console.log('result: ', result);
        // console.log('query: ', query);

        return { data: result, totalCount, totalPage, currentPage: page };
    } catch (error) {
        throw new Error(error.message);
    }
}


export const _loadAcademicModelTest = async (query, page, size) => {
    try {
        const skip = (page - 1) * size;

        const response = await AcademyModelTest.find(query)
            .populate('subjectId')
            .sort({subjectId: 1, year:-1})
            .skip(skip).limit(size).lean();

        const result = response.map(item => ({
            ...item,
            subject: item.subjectId,
            subjectId: item.subjectId?._id || null
        }));

        const totalCount = await AcademyModelTest.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!result) {
            throw new NotFoundError('Model Test not found')
        }

        return { data: result, totalCount, totalPage, currentPage: page };
    } catch (error) {
        throw new Error(error.message);
    }
}
