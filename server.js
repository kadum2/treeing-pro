

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

////////mongodb; mongo atlas
let mongodb = require("mongodb").MongoClient  ///mongodb atlas
const { ObjectID } = require("bson") 
require("dotenv").config()


////////// pages to send
app.use(express.static("./public-imgs"))
app.use("/", express.static("./home"))
app.use("/mode", express.static("./mode"))





///////plan; 
//////home 
///get confirmed; finished, unfinished 
app.get("/con-finished", (req, res)=>{
    console.log("............get con-finished.........")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let result = dbb.collection("finished").find({}).toArray()

    res.send(result)
    })
})
app.get("/con-unfinished", (req, res)=>{
    console.log("............get con-unfinished..........")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let result = dbb.collection("unfinished").find({}).toArray()

    res.send(result)
    })
})


//////multer 

app.post("/uncon", (req,res)=>{
    console.log("............get con-finished.........")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let result = dbb.collection("unconfirmed").insertOne({})

    res.send(result)
    })

})







///mode








app.listen(process.env.PORT || 3500, ()=>console.log(`listening on port ???`))

