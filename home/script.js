///////////////////////////////////////////////////////////////////////
////setting up 

const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map

        ////////the required labels
        let uncon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
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
let message = document.querySelector("#message")
let m
let currentM
let currentMm
let currentPin


let pathObjects = []
let pathList 

/////getting data; fetch confirmed; finished, unifinished 
////display data; red and green labels and imgs; based on the ????

// map.scrollWheelZoom.disable();


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
    pconfi[0]?insertLocs(pconfi, conFinished, true):null

    /////get con-unfinished; use red pin, current imgs

    let conun= await fetch("/con-unfinished")
    let pconun = await conun.json()
    console.log(pconun)
    pconun[0]?insertLocs(pconun, conUnfinished, false ):null

    /////get con-unfinished; use red pin, current imgs

    ////get the routes 
        ///fetching data; 
        let d = await fetch("/confirmed")
        pathList = await d.json()
        document.querySelector("#displaylines").removeAttribute("disabled")
        console.log(pathList)
}

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
            e.target.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
        })
        obje.addEventListener("click", (e)=>{
            pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
            e.target.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
        })
    })
}
function hideLines(pd){
    pd.forEach(e=>{
        map.removeLayer(e)
    })
}


// let suggetstMakeLinesBtn = document.createElement("a")
// suggetstMakeLinesBtn.textContent = "اضافة مسارات"
// suggetstMakeLinesBtn.classList.add("suggest")
// suggetstMakeLinesBtn.setAttribute("href", "https://coaster-route-polyline.herokuapp.com")
// suggetstMakeLinesBtn.setAttribute("href", "https://coaster-route-polyline.herokuapp.com")

//////button that shows the lines 
document.querySelector("#displaylines").addEventListener("click", (e)=>{
    console.log(e.target.classList)

    e.target.classList.toggle("add")
    if(e.target.classList.contains("add")){
        displayLines(pathList)
        // e.target.parentElement.append(suggetstMakeLinesBtn)
        document.querySelector(".suggest").style.display = "block"
    }else{
        hideLines(pathObjects)
        // e.target.parentElement.lastElementChild.remove()
        document.querySelector(".suggest").style.display = "none"

    }
})




/////insert data; make function to insert data 
let linkedList = []
let beforeImgsElements = []
let afterImgsElements = []

function insertLocs (dataList, pin, thirdOption){

    ////make marker, insert in map, insert in linkedlist; make the label functionality 
    ////make imgs, insert in containers (profile), insert in linkedlist
    ////insert id in linked list 

    dataList.forEach(e=>{

        let pBName = `<p>${e.bName}</p>`
        let pANames= e.aNames.map(ee=>{return "<p>"+ee +"</p>"})
        pANames =  pANames.join("").replace(/,/g, '')
    

        // let m
        if(e.next == true){
                    // m = L.marker(e.coords, {
                    //     icon: nextCampPin, 
                    //     popupAnchor: [-10, -30] 
                    // }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}<br><h2>التوقيت</h2><br>${e.campDate}`).addTo(map)

                    m = L.marker(e.coords, {
                        icon: nextCampPin, 
                        popupAnchor: [-10, -30] 
                    }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}`).addTo(map)

        }else{
            m = L.marker(e.coords, {
                icon: pin
            }).addTo(map).bindPopup(`<h3> ❤المساهمين </h3>${pBName}<br>${pANames}`);
        }
        m.addEventListener("click", (e)=>{

            document.querySelector("#beforeImgs").innerHTML = ""
            // document.querySelector("#bContributers").innerHTML = "" 
            document.querySelector("#afterImgs").innerHTML = ""
            // document.querySelector("#aContributers").innerHTML = "" 
            // document.querySelector("#sendFinishing").setAttribute("disabled", true)

            linkedList.forEach(ee=>{
                if(ee.m == e.target){

                    //////third option 
                    ee.thirdOption?document.querySelector("#sendFinishing").setAttribute("disabled", true):document.querySelector("#sendFinishing").removeAttribute("disabled")


                    ////beforeImgs inserting; three imgs
                    console.log(ee)

                    ///////more info display; 
                    document.querySelector("#date").textContent = ""
                    document.querySelector("#details").textContent = ""
                    ee.dateOfPlanting?document.querySelector("#date").textContent = ee.dateOfPlanting:null
                    ee.moreDetails?document.querySelector("#details").textContent = ee.moreDetails:null

                    currentM = ee.m
                    currentId = ee.id

                    console.log(ee.beforeImgsElements)
                    ee.beforeImgsElements.forEach(i=>{
                        document.querySelector("#beforeImgs").append(i)
                    })
                    // for(let i = 0; i<3; i++){
                    //     document.querySelector("#beforeImgs").append(ee.beforeImgsElements[i])
                    // }
                    
                    //////before contributers
                    // document.querySelector("#bContributers").innerHTML = `
                    // <div class="contri">
                    //     <h4 class="contributerName">${ee.bName}</h4>
                    // </div>`

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

                }
            })
        })

        beforeImgsElements = []
        e.beforeImgs.forEach(e=>{
            let img = document.createElement("img")
            img.style.backgroundImage = `url('../${e}')`
            img.style.backgroundSize = "cover"
            img.style.backgroundPosition = "center"

            beforeImgsElements.push(img)
            
        })
        afterImgsElements = []

        if(e.afterImgs[0]){

            e.afterImgs.forEach(i=>{
                let img = document.createElement("img")
                img.style.backgroundImage = `url('../${e.afterImgs[i]}')`
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






/////adding loc; new method;

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
        currentCoords = i    
    }
});




////send data 


document.querySelectorAll(".send").forEach(ee=>{

    ee.onclick= async (e)=>{
        console.log(currentCoords)
        console.log(e.target.parentElement.children)
    
        //////check if exist then empty them 
    
        let children = e.target.parentElement.children
    
        let aChildren = [...children]
        aChildren.forEach(e=>console.log(e))
        console.log(currentId)
    
    
    
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
                console.log("sending")
                await fetch("/uncon-unfinished", {
                    method: "POST", 
                    body: fd
                })
            }else if(e.target.getAttribute("id")=="sendFinished"){
                await fetch("/uncon-finished", {
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
        ////empty 
        aChildren.find(e=>e.getAttribute("class") == "names").value = ""
        if(aChildren.find(e=>e.getAttribute("class") == "addAImgs")){aChildren.find(e=>e.getAttribute("class") == "addAImgs").files = null}
        if(aChildren.find(e=>e.getAttribute("class") == "addBImgs")){aChildren.find(e=>e.getAttribute("class") == "addBImgs").files = null}
        

        m?map.removeLayer(m):null
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
    




