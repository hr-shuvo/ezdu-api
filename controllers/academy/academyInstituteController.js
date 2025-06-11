import { StatusCodes } from "http-status-codes";
import { AcademyInstitute, AcademyModelTest } from "../../models/QuestionBankModel.js";

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
            return res.status(404).json({message: "Not found institute"});
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

export const loadAcademicModelTest = async (req, res) => {
    const { instituteId, subjectId } = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if (instituteId) {
        query.instituteId = instituteId;
    }
    if (subjectId) {
        query.subjectId = subjectId;
    }

    try {
        // const data = await Course.find();
        const { data, totalCount, totalPage, currentPage } = await _loadAcademicModelTest(query, page, size);

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

        const response = await AcademyModelTest.findById(id);

        // console.log(response)

        return res.status(404).json({ message: "Failed to fetch model test" });

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

        const result = await AcademyModelTest.find(query).skip(skip).limit(size);

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
