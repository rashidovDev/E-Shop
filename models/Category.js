const {model, Schema, ObjectId} = require("mongoose")

const CategorySchema = new Schema({
    name : {type : String, required : true},
    icon : {type : String},
    color : {type : String}
})

module.exports = model("Category", CategorySchema)