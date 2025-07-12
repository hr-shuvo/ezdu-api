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
        required: [true, 'Please add a email'],
        unique: true,
        trim: true,
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

    isVerified: {type: Boolean, default: false},
    hasNotification: {type: Boolean, default: false},

    userType: {
        type: Object,
        default: null,
        validate: {
            validator: function (value) {
                if (value === null) return true;

                const validCategories = ['SSC', 'HSC', 'JOB'];
                const validGroups = ['SCIENCE', 'ARTS', 'COMMERCE'];
                const validJobTracks = ['BCS', 'BANK', 'GOVT', 'GENERAL'];

                if (typeof value !== 'object') return false;

                // Basic structure validation
                if ('category' in value &&
                    value.category !== null &&
                    value.category !== '' &&
                    !validCategories.includes(value.category)) return false;

                if ('group' in value &&
                    value.group !== null &&
                    value.group !== '' &&
                    !validGroups.includes(value.group)) return false;

                if ('jobTrack' in value &&
                    value.jobTrack !== null &&
                    value.jobTrack !== '' &&
                    !validJobTracks.includes(value.jobTrack)) return false;

                return true;
            },
            message: 'Invalid userType structure'
        }
    }

}, {timestamps: true});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // title: {
    //     type: String,
    //     required: true
    // },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true});



const TokenSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        vToken: { // verify token
            type: String,
            default: ''
        },
        rToken: { // reset token
            type: String,
            default: ''
        },
        lToken: { // login token
            type: String,
            default: ''
        },
        createdAt: {
            type: Date,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },

    }
);


const User = mongoose.model('User', UserSchema);
const Token = mongoose.model('Token', TokenSchema);

const Notification = mongoose.model('Notification', NotificationSchema);


export {
    User,
    Token,
    Notification

}


// userType: {
//         category: { String, enum: segmentTypes },
//         classId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "AcademyClass",
//             default: null
//         },
//         group: {
//             type: String,
//             enum: academyGroupTypes,
//             default: null // Only for ssc and hsc
//         },
//         jobTrack: {
//             type: String,
//             enum: ['bcs', 'bank', 'govt', 'general'],
//             default: null // Only for job
//         },
//     }

