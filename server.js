

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


//////multer; middleware to reset the imgs container 
////make it valid for both finished and unfinished; condition the filedname
let beforeImgs = []
let afterImgs = []
let basicStoringPlan = multer.diskStorage({
    destination: "./public-imgs",
    filename: (req, file, cb)=>{
        console.log(file)

        if(file.fieldname == "beforeImgs"){
            let path = new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
            beforeImgs.push(path)
            cb(null, path)
    
        }else if(file.fieldname == "afterImgs"){
            let path = new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
            afterImgs.push(path)
            cb(null, path)
    
        }

    }
})
let multerBasic = multer({storage: basicStoringPlan})




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
    let result = dbb.collection("con-finished").find({}).toArray()
    res.send(result)
    })
})
app.get("/con-unfinished", (req, res)=>{
    console.log("............get con-unfinished..........")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let result = dbb.collection("con-unfinished").find({}).toArray()
    res.send(result)
    })
})

/
////add loc; use the same plan, check if have token (authorized) then insert to con directly 


app.post("/uncon-Unfinished",(req, res, next)=>{beforeImgs= []; afterImgs = []; next()}, multerBasic.array("beforeImgs"), (req,res)=>{
    console.log("............post uncon.........", req.body)
    console.log(beforeImgs)
    ////check if the valid data; 
    if(typeof beforeImgs[0] == "string"){
        console.log("valid data")
        mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
            let dbb = client.db()
            await dbb.collection("uncon-unfinished").insertOne({
                coords: req.body.coords.split(","),
                bName: req.body.name, 
                bUserName: req.body.userName, 
                bSmType: req.body.smType,
                beforeImgs: beforeImgs,
                afterImgs: afterImgs, 
                aNames: [], 
                aUserNames: [], 
                aSmTypes: []
            })
            })
        res.sendStatus(200)
    }else{
        res.sendStatus(400)
    }
})









///mode; for each route check if it is the moderator by checking valid token 

///get
app.get("/uncon-finished",(req, res)=>{
    ///check if valid token 
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let result = await dbb.collection("uncon-finished").find().toArray()
        res.send(result)
    })
})

app.get("/uncon-unfinished",(req, res)=>{
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let result = await dbb.collection("uncon-unfinished").find({}).toArray()
        res.send(result)
    })
})


///confirm
app.post("/confirm", (req, res)=>{
    console.log("......confirm.....")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    ////check req.body.type, req.body.id or if(){}; find by id
    if(await dbb.collection("uncon-unfinished").findOne({_id: ObjectID(req.body.id)})){
        /////add to con side

        /////remove from uncon side 
        
    }else if(await dbb.collection("uncon-finished").findOne({})){

    }else{

    }
    
    })
})


////finish the loc
    /// get the old loc from con-un; add imgs to afterImgs; add the new one to
    /// con-fi; remove the old one from con-un
app.post("/finish", (req, res)=>{
})


////delete the loc; get the id 
    ////remove by id 
app.post("/delete", (req, res)=>{

})


///////////test code
// mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//             let dbb = client.db()
// })




app.listen(process.env.PORT || 3500, ()=>console.log(`listening on port ???`))

