const {model, Schema, ObjectId} = require("mongoose")

const CountrySchema = new Schema({
})

module.exports = model("Country", CountrySchema)