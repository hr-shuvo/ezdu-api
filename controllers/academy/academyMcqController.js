import { AcademyMcq } from "../../models/AcademyModel.js";
import { processImageBuffer } from "../../utils/imageHelper.js";
import cloudinary from "cloudinary";
import { promises as fs } from 'fs';


export const loadAcademyMcq = async (req, res) => {
    const { subjectId, lessonId, instituteIds } = req.query;

    const query = {};

    if (lessonId) {
        query.lessonId = lessonId;
    }
    if (subjectId) {
        query.subjectId = subjectId;
    }

    if(instituteIds && instituteIds.length > 0){
        query['instituteIds.instituteId'] = { $in: instituteIds };        
    }

    // console.log(subjectId);
    // console.log(instituteIds);

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const { data, totalCount, totalPage, currentPage } = await _loadAcademyMcq(query, page, size);

        res.status(200).json({ data, totalCount, totalPage, currentPage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch mcq", error: error.message });
    }
}


export const getAcademyMcq = async (req, res) => {
    try {
        const mcqId = req.params.id;
        if (!mcqId) {
            return res.status(400).json({ message: "Invalid mcq id", error: error.message });
        }

        const mcq = await AcademyMcq.findById(mcqId);

        if (!mcq) {
            return res.status(404).json({ message: "Failed to fetch mcq", error: error.message });
        }

        res.status(200).json(mcq);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}


export const upsertAcademyMcq = async (req, res) => {
    try {
        let mcq = { ...req.body };
        if(mcq.optionList && mcq.optionList.length > 0)
        mcq.optionList = JSON.parse(mcq.optionList);
        if(mcq.instituteIds && mcq.instituteIds.length > 0)
        mcq.instituteIds = JSON.parse(mcq.instituteIds);


        const oldMcq = await AcademyMcq.findById(mcq._id);
        const oldImagePublicId = oldMcq?.imagePublicId;
        // console.log('request  gotcha')

        if (req.file) {

            try {
                const response = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "ezdu",
                    transformation: [
                        { width: 600, crop: 'scale' },
                        { quality: 'auto:low' },
                        { fetch_format: 'auto' }
                    ],
                    format: 'jpg',
                    resource_type: 'image'
                },
                );
                await fs.unlink(req.file.path);

                mcq.imageUrl = response.secure_url;
                mcq.imagePublicId = response.public_id;

                if (oldImagePublicId) {
                    await cloudinary.v2.uploader.destroy(oldImagePublicId)
                }
            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        }

        if (mcq._id) {
            await AcademyMcq.findByIdAndUpdate(mcq._id, mcq, {
                upsert: true
            });

            res.status(200).json('update success');
        }
        else {
            await AcademyMcq.create(mcq)
            res.status(201).json('create success');
        }


    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}


























export const _loadAcademyMcq = async (query, page, size) => {
    try {

        const skip = (page - 1) * size;

        const data = await AcademyMcq.find(query).skip(skip).limit(size);

        const totalCount = await AcademyMcq.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('mcq not found')
        }

        return { data, totalCount, totalPage, currentPage: page };

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch mcq", error: error.message });
    }
}






