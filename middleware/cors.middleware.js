// function cors(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods","GET, PUT, PATCH, POST, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-type");
//     next()
// }

// module.exports = cors

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'https://www.yoursite.com', 'http://127.0.0.1:5500']

const corsOrigins = {
    origin : (origin, callback) => {
        if(allowedOrigins.indexOf(origin) != -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by Cors'))
        } 
    },
    exposedHeaders: 'x-total-count',
    optionsSuccessStatus : 200
}

module.exports = corsOrigins