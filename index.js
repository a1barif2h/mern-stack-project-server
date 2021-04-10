const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');

const authHandler = require("./routeHandler/authHandler");

require('dotenv').config();

// express app initialization
const app = express();
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

// database connection with mongoose

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.nllhk.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("connection successfully!");
})
.catch(err => {
    console.log(err);
})


// application routes
app.use("/", authHandler)


// default error handler
function errorHandler(err, req, res, next) {
    if(res.headersSent) {
        return next(err)
    }

    res.status(500).json({error: err})
}


app.listen(PORT, () => {
    console.log(`app listening at port ${PORT}`);
})