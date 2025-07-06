
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { BlogPost } from "../../models/BlogModel.js";

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

    if (blogPost._id) {
        // Check for unique slug on update (exclude current post)
        const existing = await BlogPost.findOne({ slug: blogPost.slug, _id: { $ne: blogPost._id } });
        if (existing) {
            return res.status(StatusCodes.CONFLICT).json({ message: "Slug already exists" });
        }
        await BlogPost.findByIdAndUpdate(blogPost._id, blogPost);
        res.status(StatusCodes.OK).json('update success');
    } else {
        // Check for unique slug on create
        const existing = await BlogPost.findOne({ slug: blogPost.slug });
        if (existing) {
            return res.status(StatusCodes.CONFLICT).json({ message: "Slug already exists" });
        }
        await BlogPost.create(blogPost);
        res.status(StatusCodes.CREATED).json('create success');
    }
};



















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