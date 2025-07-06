import mongoose from "mongoose";


const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    content: {
        type: String, // store your TipTap HTML here
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assumes you have a User model
        // required: true,
    },
    published: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: ['regular', 'featured', 'highlight', 'popular'],
        default: 'regular',
    },
    metaDescription: {
        type: String,
    },
    coverImage: {
        type: String, // URL to the cover/featured image
    },
    tags: [{
        type: String,
    }],
}, {timestamps: true});


const BlogPost = mongoose.model("BlogPost", BlogPostSchema);


export {
    BlogPost,
}