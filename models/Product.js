const {model, Schema, ObjectId} = require("mongoose")
const {format} = require("date-fns")

const ProductSchema = new Schema({
    name : {type : String, required : true},
    image : {type : String},
    description : {type : String},
    category : {type : String},
    // images : [{type : String}],
    brand : {type : String},
    price : {type : String}, 
    countInStock : {type : Number},
    rating : {type : Number},
    isFeatured : {type : Boolean},
    dateCreated : {type : Date, default : Date.now()}  
})

module.exports = model("Product", ProductSchema)

