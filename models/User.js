const {model, Schema, ObjectId} = require("mongoose")

const UserSchema = new Schema({
    username : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    country : {type : String},
    avatar : {type : String},
    roles : [{type : String}],
    dateRegistered : {type : Object},
    orders : {type : ObjectId, ref : "Orders"}
})

module.exports = model("User", UserSchema) 