
////setting up 


const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map

        ////////the required labels
        let uncon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });

        ////getting icon; icon is special object not just an image
        let conFinished = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-green.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });
        let conUnfinished = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });

        let finishingPin = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-orange.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });

        let nextCampPin = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-yellow.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 

        });



/////data containers and main elements 

let currentCoords
let currentId
let currentM
let currentMm
let message = document.querySelector("#message")
let m


let pathObjects = []
let pathList 





/////getting data; fetch confirmed; finished, unifinished 
////display data; red and green labels and imgs; based on the ????

window.onload = async ()=>{

    //////get api key 
    let rApiKey = await fetch("/map-api-key")
    let apiKey = await rApiKey.json()
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey.apiKey
}).addTo(map);

L.Control.geocoder().addTo(map);


    //////get con-finished; use green pin, before imgs, after imgs 

    let confi= await fetch("/con-finished")
    let pconfi= await confi.json()
    console.log(pconfi)
    insertLocs(pconfi, "basicDel", conFinished, true)

    /////get con-unfinished; use red pin, current imgs

    let conun= await fetch("/con-unfinished")
    let pconun = await conun.json()
    console.log(pconun)
    insertLocs(pconun, "basicDel", conUnfinished, false)


    /////get con-unfinished; use red pin, current imgs


    //////uncon to insert buttons to add to list and that list of id to be confirmed
    /////get uncon-unfinished (blue)

    let unun= await fetch("/uncon-unfinished")
    let punun = await unun.json()
    console.log(punun)
    insertLocs(punun, "confirm", uncon, false)

    /////get uncon-finished (blue)

    let unfi= await fetch("/uncon-finished")
    let punfi= await unfi.json()
    console.log(punfi)
    insertLocs(punfi,"confirm", uncon, true)

    /////get made finished; finishing (orange)

    let finishing= await fetch("/make-finished")
    let pfinishing= await finishing.json()
    console.log(pfinishing)
    insertLocs(pfinishing,"conFinish", finishingPin, true)


    ////get the routes 
    ///fetching data; 
        let d = await fetch("/confirmed")
        pathList = await d.json()
        document.querySelector("#displaylines").removeAttribute("disabled")
        console.log(pathList)


}



/////insert data; make function to insert data 
let linkedList = []
let beforeImgsElements = []
let afterImgsElements = []

//////data lists to send 
        // let m 

let toConfirm = []
let toDelete = []
let nextCamp


function insertLocs (dataList,confType ,pin, thirdOption){

    ////make marker, insert in map, insert in linkedlist; make the label functionality 
    ////make imgs, insert in containers (profile), insert in linkedlist
    ////insert id in linked list 

    dataList.forEach(e=>{

        let pBName = `<p>${e.bName}</p>`
        // console.log(dataList.aNames)
        let pANames= e.aNames.map(ee=>{return "<p>"+ee +"</p>"})
        console.log(pANames)
        pANames =  pANames.join("").replace(/,/g, '')
    


        if(pin){ /////no need for else 
            if(pin == conUnfinished &&e.next == true ){
                    // m = L.marker(e.coords, {
                    //     icon: nextCampPin, 
                    //     popupAnchor: [-10, -30] 
                    // }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}<br><h2>التوقيت</h2><br>${e.campDate}`).addTo(map)

                    console.log(".......using the yellow pin.............")

                    m = L.marker(e.coords, {
                        icon: nextCampPin, 
                        popupAnchor: [-10, -30] 
                    }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}`).addTo(map)
            }else{
                m = L.marker(e.coords, {
                    icon: pin, 
                    popupAnchor: [-10, -30] 
                }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}`).addTo(map)
                // m;
            }
        }else{ ////no need for this 
            m = L.marker(e.coords).addTo(map).bindPopup(`<h3>?❤المساهمين</h3>${pBName}<br>${pANames}`);
        }

        console.log(m)
        m.addEventListener("click", (eee)=>{

            document.querySelector("#beforeImgs").innerHTML = ""
            // document.querySelector("#bContributers").innerHTML = "" 
            document.querySelector("#afterImgs").innerHTML = ""
            // document.querySelector("#aContributers").innerHTML = "" 

            linkedList.forEach(ee=>{
                if(ee.m == eee.target){
                    currentId = ee.id
                    currentM = ee.m

                    ////third option
                    console.log(ee.thirdOption) 
                    ee.thirdOption?document.querySelector("#sendFinishing").setAttribute("disabled", true):document.querySelector("#sendFinishing").removeAttribute("disabled")

                    ///////more info display; 
                    document.querySelector("#date").textContent = ""
                    document.querySelector("#details").textContent = ""
                    ee.dateOfPlanting?document.querySelector("#date").textContent = ee.dateOfPlanting:null
                    ee.moreDetails?document.querySelector("#details").textContent = ee.moreDetails:null

                    ////beforeImgs inserting; three imgs
                    ee.beforeImgsElements.forEach(i=>{
                        document.querySelector("#beforeImgs").append(i)
                    })
                    // for(let i = 0; i<3; i++){
                    //     document.querySelector("#beforeImgs").append(ee.beforeImgsElements[i])
                    // }
                    /////after;
                    if(ee.afterImgsElements[0]){
                        ee.afterImgsElements.forEach(i=>{
                            document.querySelector("#afterImgs").append(i)
                        })
                        // for(let i = 0; i<3; i++){
                        //     document.querySelector("#afterImgs").append(ee.afterImgsElements[i])
                        // }
    
                    }else{
                        document.querySelector("#afterImgs").innerHTML = `<h1> قريبا </h1>`
                    }

                    document.querySelector("#buttons").innerHTML = ""
                    if(confType == "confirm" || confType == "conFinish"){
                        let conf = document.createElement("button")
                        confType == "confirm"?conf.textContent = "confirm":conf.textContent = "finished"
                        conf.addEventListener("click", (e)=>{
                            document.querySelector("#beforeImgs").innerHTML = ""
                            document.querySelector("#afterImgs").innerHTML = ""

                            toConfirm.push(currentId)

                            map.removeLayer(currentM)
                            document.querySelector("#buttons").innerHTML = ""

                        })

                        let del = document.createElement("button")
                        del.classList.add("red")
                        confType == "confirm"?del.textContent = "delete":del.textContent = "not finished"

                        // del.textContent = "delete"
                        del.addEventListener("click", (e)=>{
                            document.querySelector("#beforeImgs").innerHTML = ""
                            document.querySelector("#afterImgs").innerHTML = ""
                            toDelete.push(currentId)

                            map.removeLayer(currentM)
                            document.querySelector("#buttons").innerHTML = ""

                        })
                        document.querySelector("#buttons").append(conf, del)

                    }else if (confType == "basicDel"){

                        console.log("confirmed pin")

                        let del = document.createElement("button")
                        del.textContent = "delete"
                        del.classList.add("red")
                        del.addEventListener("click", (e)=>{
                            document.querySelector("#beforeImgs").innerHTML = ""
                            document.querySelector("#afterImgs").innerHTML = ""
                            toDelete.push(currentId)

                            map.removeLayer(currentM)
                            document.querySelector("#buttons").innerHTML = ""

                        })
                        document.querySelector("#buttons").append(del)

                        if(e.next == false || e.next == true){
                            console.log("next prop")

                            let makeNext = document.createElement("button")
                            makeNext.classList.add("makeNextBtn")
                            makeNext.textContent = "القادمة"
                            makeNext.addEventListener("click", (e)=>{
                                nextCamp = currentId
                            })
                            document.querySelector("#buttons").append(makeNext)
                        }else{
                            console.log("no next prop")
                        }

                    }
                }
            })
        })

        beforeImgsElements = []
        e.beforeImgs.forEach(e=>{
            let img = document.createElement("img")
            img.style.backgroundImage = `url('${e}')`
            img.style.backgroundSize = "cover"
            img.style.backgroundPosition = "center"
            beforeImgsElements.push(img)
        })
        afterImgsElements = []

        if(e.afterImgs[0]){

            e.afterImgs.forEach(i=>{
                let img = document.createElement("img")
                img.style.backgroundImage = `url('${i}')`
                img.style.backgroundSize = "cover"
                img.style.backgroundPosition = "center"
                afterImgsElements.push(img)
            })

            // for(let i = 0; i<4; i++){
            //     let img = document.createElement("img")
            //     img.style.backgroundImage = `url('../${e.afterImgs[i]}')`
            //     img.style.backgroundSize = "cover"
            //     img.style.backgroundPosition = "center"
            //     afterImgsElements.push(img)
            // }
        }

        linkedList.push({m:m, beforeImgsElements: beforeImgsElements, id: e._id, afterImgsElements: afterImgsElements, bName: e.bName, aNames: e.aNames, thirdOption,dateOfPlanting:e.dateOfPlanting, moreDetails: e.moreDetails})
    })

}


// /////insert data; make function to insert data 
// let linkedList = []
// let beforeImgsElements = []
// let afterImgsElements = []

// function insertLocs (dataList, mode){

//     ////make marker, insert in map, insert in linkedlist; make the label functionality 
//     ////make imgs, insert in containers (profile), insert in linkedlist
//     ////insert id in linked list 

//     dataList.forEach(e=>{
//         let m = L.marker(e.coords, {
//             icon: uncon
//         }).addTo(map);

//         m.addEventListener("click", (e)=>{
//             linkedList.forEach(ee=>{
//                 if(ee.m == e.target){
                    
//                     ////beforeImgs inserting; three imgs
//                     document.querySelector("#beforeImgs").innerHTML = ""
//                     for(let i = 0; i<3; i++){
//                         document.querySelector("#beforeImgs").append(ee.beforeImgsElements[i])
//                     }

//                     //////before contributers 
//                     ee.bSmType == "instagram"?ee.bSmType = "":ee.bSmType = ""

//                     document.querySelector("#bContributers").innerHTML = `
//                     <div class="contri">
//                         <h4 class="contributerName">${ee.bName}</h4>
//                         <img class="smType" style='background-image: url("../instagram-icon.jpg");    background-size: cover;
//                         background-position: center;
//                         height: 100%;
//                         width: 100%;
//                     '>
//                         <h4 class="contributerUserName">${ee.bUserName}</h4>
//                     </div>`

//                     /////after; 
//                     document.querySelector("#aContributers").innerHTML = `
//                     `

//                 }
//             })
//         })

//         beforeImgsElements = []
//         e.beforeImgs.forEach(e=>{
//             let img = document.createElement("img")
//             img.style.backgroundImage = `url('../${e}')`
//             img.style.backgroundSize = "cover"
//             img.style.backgroundPosition = "center"

//             beforeImgsElements.push(img)
            
//         })

//         if(e.afterImgs[0]){
//             afterImgsElements = []

//             for(let i = 0; i<4; i++){

//                 let img = document.createElement("img")
//                 img.style.backgroundImage = `url('../${e.afterImgs[i]}')`
//                 img.style.backgroundSize = "cover"
//                 img.style.backgroundPosition = "center"
//                 afterImgsElements.push(img)
//             }
//         }

//         linkedList.push({m:m, beforeImgsElements: beforeImgsElements, id: e.id, afterImgsElements: afterImgsElements, bName: e.bName, bUserName: e.bUserName, aNames: e.aNames, aUserNames: e.aUserNames})
//     })

//     if(mode){ ///insert buttons 
//         console.log("adding buttons")

//     }

// }



/////adding loc

//////new method; 
document.querySelectorAll(".addCoords").forEach(e=>{
    e.addEventListener("click", (ee)=>{
        ee.target.classList.toggle("red")
        ee.target.getAttribute("id") == "addUnconUnfinishedCoords"?currentPin = conUnfinished:currentPin=conFinished
    })
})
map.addEventListener('click', function (ev) {
    currentMm?map.removeLayer(currentMm):null

    if(document.querySelector("#addUnconUnfinishedCoords").classList.contains("red") || document.querySelector("#addUnconFinishedCoords").classList.contains("red")){
        let latlng = map.mouseEventToLatLng(ev.originalEvent);
        let i = [latlng.lat, latlng.lng]
        currentMm = L.marker(i, {
            icon: currentPin
        }).addTo(map);
        m = currentMm
        currentCoords = i    
    }
});



//////display project 1 lines 

function displayLines (pd){
    console.log("get routes; ", pd)
    
    Object.values(pd).forEach(e=>console.log(e.path))

    ///deploy them; store
    Object.values(pd).forEach(e => {

        let obje 

        if(typeof e.path[0]!="number"){

            console.log(e.path)
            obje = L.polyline(e.path, {
                // color: "red",
            }).addTo(map)
            // oldObjects.push(pathId) //dont need old objects
            // pathob.addEventListener("click", (e) => console.log(e.target))
        } else { ////labels part 
            console.log("....label....")

            obje = L.circle(e.path, {
                fillColor: '#3388FF',
                fillOpacity: 0.8,
                radius: 100
            }).addTo(map)
        }

        pathObjects.push(obje)
        obje.addEventListener("mouseover", (e)=>{
            pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
            let i = e.target
            map.removeLayer(e.target)
            i.addTo(map)
            pathObjects.push(i)
            i.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
        })
        obje.addEventListener("click", (e)=>{
            pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
            let i = e.target
            map.removeLayer(e.target)
            i.addTo(map)
            pathObjects.push(i)
            i.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
        })
    })
}
function hideLines(pd){
    pd.forEach(e=>{
        map.removeLayer(e)
    })
}


//////button that shows the lines 
document.querySelector("#displaylines").addEventListener("click", (e)=>{
    console.log(e.target.classList)

    e.target.classList.toggle("add")
    if(e.target.classList.contains("add")){
        displayLines(pathList)
    }else{
        hideLines(pathObjects)
    }
})



////send data 

document.querySelectorAll(".send").forEach(ee=>{

ee.onclick= async (e)=>{
    console.log(currentCoords)
    console.log(e.target.parentElement.children)

    //////check if exist then empty them 

    let children = e.target.parentElement.children

    let aChildren = [...children]
    aChildren.forEach(e=>console.log(e))



    if((currentCoords || currentId) && children[3].files[0] && children[3].files[1] && children[3].files[2]){

        message.innerHTML = ""
        // console.log(children[3].files)
        let fd = new FormData()

        /////coords 
        e.target.getAttribute("id") == "sendUnfinished" || e.target.getAttribute("id") == "sendFinished"?fd.append("coords", currentCoords):fd.append("id", currentId)

        /////imgs 
        if(aChildren.find(e=>e.getAttribute("class") == "addBImgs")){
            console.log("found b img", aChildren.find(e=>e.getAttribute("class") == "addBImgs").files)
            for (let i of aChildren.find(e=>e.getAttribute("class") == "addBImgs").files) {
                fd.append(`bImgs`, i);
            }
            }
        if(aChildren.find(e=>e.getAttribute("class") == "addAImgs")){
            console.log("found a img", aChildren.find(e=>e.getAttribute("class") == "addAImgs").files)
            for (let i of aChildren.find(e=>e.getAttribute("class") == "addAImgs").files) {
                fd.append(`aImgs`, i);
            }
            }

        /////names 
        fd.append("names", aChildren.find(e=>e.getAttribute("class") == "names").value)

        /////more details; 
        if(aChildren.find(e=>e.getAttribute("class") == "moreDetails")){
            fd.append("moreDetails", aChildren.find(e=>e.getAttribute("class") == "moreDetails").value)
            fd.append("dateOfPlanting", aChildren.find(e=>e.getAttribute("class") == "dateOfPlanting").value)
        }

        console.log(fd)


        ///send 
        if(e.target.getAttribute("id")=="sendUnfinished"){
            await fetch("/con-unfinished", {
                method: "POST", 
                body: fd
            })
        }else if(e.target.getAttribute("id")=="sendFinished"){
            await fetch("/con-finished", {
                method: "POST", 
                body: fd
            })
        }else if (e.target.getAttribute("id")=="sendFinishing"){
            await fetch("/make-finishing", {
                method: "POST", 
                body: fd
            })
        }



        ////empty 
        aChildren.find(e=>e.getAttribute("class") == "names").value = ""
        if(aChildren.find(e=>e.getAttribute("class") == "addAImgs")){aChildren.find(e=>e.getAttribute("class") == "addAImgs").files = null}
        if(aChildren.find(e=>e.getAttribute("class") == "addBImgs")){aChildren.find(e=>e.getAttribute("class") == "addBImgs").files = null}
        

        map.removeLayer(m)
        currentCoords = ""
        currentId = ""
        if(aChildren.find(e=>e.getAttribute("class") == "moreDetails")){
            aChildren.find(e=>e.getAttribute("class") == "moreDetails"). value = ""
            aChildren.find(e=>e.getAttribute("class") == "dateOfPlanting").value = ""
        }

    }else{
        message.innerHTML = "fill the rest input"
    }
}
})

document.querySelector("#send-mode").addEventListener("click", async (e)=>{
    let sent = await fetch("/send-mode", {
        method: "POST", 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({toConfirm, toDelete, nextCamp})
    })

    toConfirm = []
    toDelete = []
})


