const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const {logger} = require("./middleware/logger")
const errorHandler = require('./middleware/errorHandler')
const productRouter = require("./routes/product.routes")
const categoryRouter = require("./routes/category.routes")
const userRouter = require("./routes/user.routes")
const orderRouter = require("./routes/orders.routes")
const countryRouter = require("./routes/country.routes")
const cors = require("cors")
const corsOrigins = require("./middleware/cors.middleware")
const app = express()
const PORT = config.get("serverPort") || 5500

//middleware 
app.use(cors(corsOrigins))
app.use(logger)
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static("static/user"))
app.use(express.static("uploads/product"))
// app.use(fileUpload({})) 

// app.use(express.static("static"))

app.use("/api/countries",countryRouter)
app.use("/api/product",productRouter)
app.use(fileUpload())
app.use("/api/category",categoryRouter)
app.use("/api/auth", userRouter)
app.use("/api/order", orderRouter)

app.get('/product', (req, res) => {
    res.send("Hello backend")
})

const start = async () => {
    try{
        await mongoose.connect(config.get("dbUrl"),{
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        .then(() => {
        console.log("Mongo DB connected succesfully")
        }) 
        .catch((err) => {
            console.error(err)
        })
        app.use(errorHandler)
        app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`))
    }catch(e){
        console.log(e)
    }
}

start()