const {model, Schema, ObjectId} = require("mongoose")

const ProductSchema = new Schema({
    name : {type : String, required : true},
    image : {type : String, required : true},
    countInStock : {type : Number, required : true}
})

module.exports = model("Product", ProductSchema)

