import mongoose from "mongoose";
import { segmentTypes, academyGroupTypes } from "./AcademyModel.js";


const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // lastName: {
    //     type: String,
    //     default: 'lastName'
    // },
    location: {
        type: String,
        default: 'location'
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin', 'super-admin'],
        default: 'user'
    },
    avatar: String,
    avatarPublicId: String,

    userType: {
        category: { String, enum: segmentTypes },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademyClass",
            default: null
        },
        group: {
            type: String,
            enum: academyGroupTypes,
            default: null // Only for ssc and hsc
        },
        jobTrack: {
            type: String,
            enum: ['bcs', 'bank', 'govt', 'general'],
            default: null // Only for job
        }

    }

}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

export default mongoose.model('User', UserSchema);