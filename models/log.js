const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogItemSchema = new Schema({
    description: String,
    duration: Number,
    date: Date
});

const logSchema = new Schema({
    username: String,
    count: Number,
    log: [LogItemSchema]
});

module.exports = mongoose.model('log', logSchema);