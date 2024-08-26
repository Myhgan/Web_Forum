var express = require('express');
var router = express.Router();

//->localhost:3000/api/v1

//localhost:3000/api/v1/topics
router.use('/topics', require('./topics'))

//localhost:3000/api/v1/searchs
router.use('/searchs', require('./searchs'))

//localhost:3000/api/v1/categories
router.use('/categories', require('./categories'))

//localhost:3000/api/v1/users
router.use('/users', require('./users'))

//localhost:3000/api/v1/auth
router.use('/auth', require('./auth'))

//localhost:3000/api/v1/comments
router.use('/comments', require('./comments'))

module.exports = router;
