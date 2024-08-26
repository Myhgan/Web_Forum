// /schemas/topic.js
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    topicTitle: {
        type: String,
        required: true,
        unique: true
    },
    topicType: String,
    topicBody: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [String],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('topic', topicSchema);
