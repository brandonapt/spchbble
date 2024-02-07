const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.mongo)

const config = new Schema({
    id: String,
    prefix: String
})

const server = new Schema({
    id: String,
    name: String
})

module.exports = mongoose.model('configuration', config);