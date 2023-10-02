const {model, Schema, ObjectId} = require("mongoose")
const {format} = require("date-fns")
const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')

const ProductSchema = new Schema({
    name : {type : String, required : true},
    description : {type : String, required : true},
    image : {type : String, default : ''},
    images : [{type : String}],
    brand : {type : String, default : ''},
    price : {type : Number,  default : 0},
    category : {type : ObjectId, ref : "Category", required : true},
    countInStock : {type : Number, required : true, min : 0, max : 255},
    rating : {type : Number, default : 0},
    isFeatured : { type : Boolean, default : false},
    dateCreated : {type : Date, default : dateTime}
})


module.exports = model("Product", ProductSchema)

