const {model, Schema, ObjectId} = require("mongoose")

const UserSchema = new Schema({
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    phoneNumber : {type : String, required : true},
    isAdmin : {type : Boolean, default : false},
    country : {type : String, default : ''},
    orders : {type : ObjectId, ref : "Orders"}
})

module.exports = model("User", UserSchema)