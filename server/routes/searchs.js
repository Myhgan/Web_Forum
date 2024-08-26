const express = require('express');
const router = express.Router();
const Topic = require('../schemas/topic');
const User = require('../schemas/user');
const Category = require('../schemas/category');

router.get('/', async (req, res) => {
    try {
        const searchParams = req.query;
        const topicQuery = {};
        const userQuery = {};
        const categoryQuery = {};

        if (searchParams.title) {
            topicQuery.topicTitle = { $regex: new RegExp(searchParams.title, 'i') };
        }
        if (searchParams.username) {
            userQuery.username = { $regex: new RegExp(searchParams.username, 'i') };
        }
        if (searchParams.category) {
            categoryQuery.name = { $regex: new RegExp(searchParams.category, 'i') };
        }

        const categories = await Category.find(categoryQuery).exec();
        const categoryIds = categories.map(category => category._id);

        if (categoryIds.length > 0) {
            userQuery.category = { $in: categoryIds };
        }

        const users = await User.find(userQuery).exec();
        topicQuery.category = { $in: categoryIds };

        const topics = await Topic.find(topicQuery)
            .populate('category')
            .exec();

        res.json({ topics, users, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
