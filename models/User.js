const {model, Schema, ObjectId} = require("mongoose")

const UserSchema = new Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    avatar : {type : String},
    roles : [{type : String}],
    orders : {type : ObjectId, ref : "Orders"}
})

module.exports = model("User", UserSchema)