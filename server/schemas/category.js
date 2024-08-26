// /schemas/category.js
var mongoose = require("mongoose");

var categoryShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true })
categoryShema.virtual('published', {
    ref: 'topic',
    localField: '_id',
    foreignField: 'category'
})
categoryShema.set('toJSON', { virtuals: true })
categoryShema.set('toObject', { virtuals: true })

module.exports = new mongoose.model('category', categoryShema);