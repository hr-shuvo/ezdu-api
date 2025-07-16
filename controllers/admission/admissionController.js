import mongoose from "mongoose";
import { _loadAcademicClass } from "../../services/academy/academicClassService.js";
import { StatusCodes } from "http-status-codes";
import { AdmissionCategory, AdmissionCategoryUnit } from "../../models/AcademyModel.js";


export const loadAdmissionCategory = async (req, res) => {
    const { segment } = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if (segment) {
        query.segment = segment;
    }

    // console.log(query);

    try {
        // const data = await Course.find();
        const { data, totalCount, totalPage, currentPage } = await _loadAdmissionCategory(query, page, size);

        res.status(200).json({ data, totalCount, totalPage, currentPage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admission category", error: error.message });

    }
}

export const getAdmissionCategory = async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Invalid class id" });
        }

        let result;

        if (mongoose.Types.ObjectId.isValid(id)) {
            result = await AdmissionCategory.findById(id);
        } else {
            result = await AdmissionCategory.findOne({ id });
        }

        if (!result) {
            return res.status(404).json({ message: "Not found admission" });
        }

        const units = await _loadAdmissionCategoryUnit({ categoryId: result._id }, 1, 100);
        const admissionWithUnits = {
            ...result.toObject?.() ?? result, // ensure plain object if Mongoose doc
            units: units.data,
        };


        res.status(200).json(admissionWithUnits);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch class", error: error.message });
    }
}

export const upsertAdmissionCategory = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const cat = req.body;

    if (cat._id) {
        await AdmissionCategory.findByIdAndUpdate(cat._id, cat);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AdmissionCategory.create(cat)
        res.status(StatusCodes.CREATED).json('create success');
    }
};

// // // // // // // // // // // // // // //


export const loadAdmissionCategoryUnit = async (req, res) => {
    const { segment, categoryId } = req.query;

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    const query = {};

    if (categoryId) {
        query.categoryId = categoryId;
    }
    if (segment) {
        query.segment = segment;
    }

    // console.log(query);

    try {
        // const data = await Course.find();
        const { data, totalCount, totalPage, currentPage } = await _loadAdmissionCategoryUnit(query, page, size);

        res.status(200).json({ data, totalCount, totalPage, currentPage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admission category unit", error: error.message });

    }
}


export const getAdmissionCategoryUnit = async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Invalid unit id" });
        }

        let result;

        if (mongoose.Types.ObjectId.isValid(id)) {
            result = await AdmissionCategoryUnit.findById(id);
        } else {
            result = await AdmissionCategoryUnit.findOne({ id });
        }

        if (!result) {
            return res.status(404).json({ message: "Failed to fetch admission unit" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch unit", error: error.message });
    }
}


export const upsertAdmissionCategoryUnit = async (req, res) => {

    // console.log(req.body)
    // req.body.createdBy = req.user.userId;

    const model = req.body;

    if (model._id) {
        await AdmissionCategoryUnit.findByIdAndUpdate(model._id, model);
        res.status(StatusCodes.OK).json('update success');
    } else {
        await AdmissionCategoryUnit.create(model)
        res.status(StatusCodes.CREATED).json('create success');
    }
};














export const _loadAdmissionCategory = async (query, page, size) => {
    try {
        const skip = (page - 1) * size;

        const data = await AdmissionCategory.find(query).skip(skip).limit(size);

        const totalCount = await AdmissionCategory.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('Admission category class not found')
        }

        return { data, totalCount, totalPage, currentPage: page };

    } catch (error) {
        throw new Error(error.message);
    }
}

export const _loadAdmissionCategoryUnit = async (query, page, size) => {
    try {
        const skip = (page - 1) * size;

        const data = await AdmissionCategoryUnit.find(query).skip(skip).limit(size);

        const totalCount = await AdmissionCategoryUnit.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            data = [];
        }

        return { data, totalCount, totalPage, currentPage: page };

    } catch (error) {
        throw new Error(error.message);
    }
}