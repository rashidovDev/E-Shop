const {model, Schema, ObjectId} = require("mongoose")

const OrderItemSchema = new Schema({
   quantity : {type : Number, required : true},
   product : {type : ObjectId, ref : "Product"}, 
})

module.exports =model("OrderItem", OrderItemSchema)