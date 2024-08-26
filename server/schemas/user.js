//  /schemas/user.js
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const crypto = require('crypto');
const { generateAvatar, saveAvatarImage } = require('../validators/avatarGenerator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    avatar: String,
    password: String,
    role: {
        type: [String]
    },
    status: {
        type: Boolean,
        default: true
    },
    email: String,
    ResetPasswordToken: String,
    ResetPasswordTokenExp: String,
    banned: {
        type: Boolean,
        default: false
    },
    banExpires: {
        type: Date
    }
}, { timestamps: true });

userSchema.pre('save', function () {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    const initials = getInitials(this.username);
    this.avatar = saveAvatarImage(this.username, generateAvatar(initials));
});

function getInitials(username) {
    const initialsArray = username.split(' ').map(word => word.charAt(0).toUpperCase());
    return initialsArray.join('');
}

userSchema.methods.genJWT = function () {
    return jwt.sign({
        id: this._id
    }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXP
    });
};

userSchema.methods.genRestPasswordToken = function () {
    this.ResetPasswordToken = crypto.randomBytes(30).toString('hex');
    this.ResetPasswordTokenExp = Date.now() + 10 * 60 * 1000;
    return this.ResetPasswordToken;
};

module.exports = mongoose.model('User', userSchema);
