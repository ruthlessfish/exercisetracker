const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date
});

module.exports = mongoose.model('exercise', exerciseSchema);