const {model, Schema, ObjectId} = require("mongoose")

const OrderSchema = new Schema({
    orderItems : [{type : ObjectId, ref : "OrderItem"}],
    status : {type : String, required : true, default : "pending"},
    totalPrice : {type : Number},
    dateOrdered : {type : Date, default : Date.now},
    user : {type : ObjectId, ref : "User"}
})

module.exports =model("Order", OrderSchema)