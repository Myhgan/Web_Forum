const e = require('express');
var express = require('express');
var router = express.Router();
var categoryModel = require('../schemas/category')
var responseHandle = require('../helpers/responseHandle');

router.get('/', async function (req, res, next) {
  try {
    
    var categories = await categoryModel.find({})
    res.send(categories);
  } catch (error) {
    responseHandle.renderResponse(res, false, error);
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name
    })
    await newCategory.save();
    responseHandle.renderResponse(res, true, newCategory);
  } catch (error) {
    responseHandle.renderResponse(res, false, error);
  }
});

module.exports = router;
