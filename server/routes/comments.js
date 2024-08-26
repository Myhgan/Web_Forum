const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
var responseHandle = require('../helpers/responseHandle');
const Topic = require('../schemas/topic');

router.get('/:topicId', async function (req, res, next) {
    try {
        const comments = await Comment.find({ topic: req.params.topicId, isDeleted: false })
        .populate('user')
        // .populate('topic')
        .exec();
        responseHandle.renderResponse(res, true, comments);
    } catch (error) {
        responseHandle.renderResponse(res, false, error);
    }
});


// Endpoint để tạo một comment mới cho một topic
router.post('/', async function (req, res, next) {
    try {
        const newComment = new Comment({
            content: req.body.content,
            user: req.body.user,
            topic: req.body.topic
        });
        await newComment.save();
        responseHandle.renderResponse(res, true, newComment);
    } catch (error) {
        responseHandle.renderResponse(res, false, error);
    }
});

module.exports = router;
