const express = require('express'),
    body_parser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose')
const app = express()

// middleware

app.use(body_parser.json())

// cors origins 
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    maxAge: 100000
}))

// DB connection
mongoose.connect('mongodb://localhost:27017/GuestBook')

var user = require("./controllers/userApi")
app.use("/users", user)


app.listen(8085)



