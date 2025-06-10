import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    avatarPublicId: String

});

UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
}

export default mongoose.model('User', UserSchema);