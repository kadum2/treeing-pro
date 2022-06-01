

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors") /////to remove later
// const path = require("path")
// const fs = require("fs")
const multer  = require("multer") 
let bodyParser = require('body-parser')
let cookieParser = require("cookie-parser")


app.use(cookieParser())
app.use(cors())    /////to remove 
app.use(express.json());
app.use(express.urlencoded({ extended: false }))



////////mongodb; mongo atlas
let mongodb = require("mongodb").MongoClient  ///mongodb atlas
const { ObjectID } = require("bson") 
require("dotenv").config()


////////// pages to send
app.use(express.static("./public-imgs"))
app.use("/", express.static("./home"))

app.use("/mode",(req, res, next)=>{
    if(req.cookies.modeAuth){
        ////send the full page
        console.log(req.cookies.token)
        if(req.cookies.modeAuth == process.env.MODEAUTH)
        console.log("will send the full page")
        next()
    }else{
        ////send the cred making 
        res.send(`    <input type="text" name="" id="em" placeholder="em">
        <button onclick="fetch('/checkmode', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                em: document.querySelector('#em').value,
            })
        })
    ">send</button>
    `)
    }
}, express.static("./mode"))


app.post("/checkmode", (req, res)=>{
    console.log("check mode .......",req.body)
    /////check if true auth to give a set the cookie
    if(req.body.em == process.env.MODEAUTH){
        res.cookie("modeAuth", process.env.MODEAUTH);
        // res.redirect("/mode") ///make a reload instead
        res.redirect(req.get("/mode"))
    }else{
        res.sendStatus(400)
    }
})




////getting map api key; 

app.get("/map-api-key", (req, res)=>{
    res.send({apiKey: process.env.MAPAPIKEY})
})


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


//////multer; middleware to reset the imgs container 
////make it valid for both finished and unfinished; condition the filedname
let beforeImgs = []
let basicStoringPlan = multer.diskStorage({
    destination: "./public-imgs",
    filename: (req, file, cb)=>{
        console.log(file)
        let path = new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        beforeImgs.push(path)
        cb(null, path)
    }
})
let multerBasic = multer({storage: basicStoringPlan})

app.post("/unconUnfinished",(req, res, next)=>{beforeImgs= []; next()}, multerBasic.array("unconUnfinishedImgs"), (req,res)=>{
    console.log("............post uncon.........", req.body)
    console.log(beforeImgs)
    ////check if the valid data; 
    if(typeof beforeImgs[0] == "string"){
        console.log("valid data")
        mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
            let dbb = client.db()
            await dbb.collection("uncon-unfinished").insertOne({
                coords: req.body.coords.split(","),
                name: req.body.name, 
                userName: req.body.userName, 
                smType: req.body.smType,
                currentStateImgs: beforeImgs
            })
            })
        res.sendStatus(200)
    }else{
        res.sendStatus(400)
    }
})









///mode


app.get("/uncon-finished",(req, res)=>{

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let result = dbb.collection("unconf-finished").find().toArray()
        
    })

})



///confirm
app.post("/confirm", (req, res)=>{
    console.log("......confirm.....")
    ////check req.body.type, req.body.id or if(){}
})



///////////test code
// mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//             let dbb = client.db()
// })




app.listen(process.env.PORT || 3500, ()=>console.log(`listening on port ???`))

