const {model, Schema, ObjectId} = require("mongoose")
const {format} = require("date-fns")

const ProductSchema = new Schema({
    name : {type : String, required : true},
    imageUrl : {type : String},
    // 
    
})

module.exports = model("Product", ProductSchema)

