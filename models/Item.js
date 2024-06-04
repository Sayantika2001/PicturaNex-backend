const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const itemModel = mongoose.model("Item", itemSchema)
module.exports = itemModel