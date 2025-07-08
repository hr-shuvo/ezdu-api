
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { BlogPost } from "../../models/BlogModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const loadBlogPost = async (req, res) => {
    const {type} = req.query;

    const query = {};

    if(type){
        query.type = type;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const {data, totalCount, totalPage, currentPage} = await _loadBlogPost(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
    }
}


export const getBlogPost = async (req, res) => {

    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({message: "Invalid blog id"});
        }

        // const result = await AcademyClass.findById(id);
        const result = await BlogPost.findOne(
            mongoose.Types.ObjectId.isValid(id)
                ? { _id: id }
                : { slug: id }
        );

        if (!result) {
            return res.status(404).json({message: "Blog not found"});
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch blog", error: error.message});
    }
}



export const upsertBlogPost = async (req, res) => {
    const blogPost = req.body;

    try{
        const existing = await BlogPost.findOne({
            $or: [
                { _id: blogPost._id },
                { slug: blogPost.slug }
            ]
        });
        const oldCoverImagePublicId = existing?.coverImagePublicId;
        // return res.status(StatusCodes.OK).json(blogPost);

        if (blogPost._id) {
            // Update case
            if (!existing) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "Blog post not found" });
            }

            if (existing._id.toString() !== blogPost._id) {
                return res.status(StatusCodes.CONFLICT).json({ message: "Slug already exists" });
            }
        } else {
            // Create case
            if (existing) {
                return res.status(StatusCodes.CONFLICT).json({ message: "Slug already exists" });
            }
        }

        if (req.file) {
            try {
                const response = await cloudinary.v2.uploader.upload(req.file.path, {
                        folder: "ezdu/blog",
                        transformation: [
                            { width: 600, crop: 'scale' },
                            { quality: 'auto:low' },
                            { fetch_format: 'auto' }
                        ],
                        // format: 'jpg',
                        resource_type: 'image'
                    },
                );
                await fs.unlink(req.file.path);

                blogPost.coverImageUrl = response.secure_url;
                blogPost.coverImagePublicId = response.public_id;

                if (oldCoverImagePublicId) {
                    await cloudinary.v2.uploader.destroy(oldCoverImagePublicId);
                }
            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        }

        if (blogPost._id) {
            await BlogPost.findByIdAndUpdate(blogPost._id, blogPost);

            res.status(StatusCodes.OK).json('update success');
        } else {
            await BlogPost.create(blogPost);
            res.status(StatusCodes.CREATED).json('create success');
        }
    }
    catch (error) {
        await removeImageFromCloudinary(blogPost.coverImagePublicId);
        return res.status(500).json({ message: "Failed to process request", error: error.message });
    }

};
















const removeImageFromCloudinary = async (publicId) => {
    if (!publicId) return;

    try {
        await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
        throw new Error(error.message);
    }
}



export const _loadBlogPost = async (query, page, size) => {
    try {

        const skip = (page-1) *  size;

        const data = await BlogPost.find(query).skip(skip).limit(size);

        const totalCount = await BlogPost.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);


        return {data, totalCount, totalPage, currentPage:page};

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
    }
}