const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const bodyParser = require("body-parser")
const {logger} = require("./middleware/logger")
const errorHandler = require('./middleware/errorHandler')
const productRouter = require("./routes/product.routes")
const categoryRouter = require("./routes/category.routes")
const app = express()
const PORT = config.get("serverPort") || 5500

//middleware 
app.use(logger)
app.use(express.json())
app.use(bodyParser.json())

app.use("/api/product",productRouter)
app.use("/api/category",categoryRouter)

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