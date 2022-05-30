

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
const path = require("path")
const fs = require("fs")
const multer  = require("multer") 
let bodyParser = require('body-parser')

app.use(cors())

//express configuration 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json()) /// no need
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true})) //no need


////////mongodb 
//// mongo atlas

let mongodb = require("mongodb").MongoClient  ///mongodb atlas
const { ObjectID } = require("bson") 
// const { markAsUntransferable } = require("worker_threads")
// let ObjectId = require('mongodb').ObjectID;
require("dotenv").config()




////////// pages to send
app.use(express.static("./public-imgs"))
app.use("/", express.static("./home"))
app.use("/mode", express.static("./mode"))





///////plan; 
//////home 
///get confirmed; finished, unfinished 
app.get("/confirmed", (req, res)=>{
    console.log("............get confiremed..........")


})



///mode








app.listen(process.env.PORT || 3500, ()=>console.log(`listening on port ???`))

