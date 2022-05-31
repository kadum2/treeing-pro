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
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
        let conUnfinished = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });




/////data containers

let currentCoords

/////main elements 
let sendUnconUnfinished = document.querySelector("#sendUnconUnfinished")
let sendUnconFinished = document.querySelector("#sendUnconFinished")
let message = document.querySelector("#message")

//////dont need dom data containers; will use the e.target parent method
let addUnconUnfinishedCoords = document.querySelector("#addUnconUnfinishedCoords")
let addUnconUnfinishedImgs = document.querySelector("#addUnconUnfinishedImgs")


let m
addUnconUnfinishedCoords.onclick = () => {
    addUnconUnfinishedCoords.classList.toggle("on")
}

map.addEventListener('click', function (ev) {
    m?map.removeLayer(m):null

    if (addUnconUnfinishedCoords.classList.contains("on")) {
        let latlng = map.mouseEventToLatLng(ev.originalEvent);
        let i = [latlng.lat, latlng.lng]
        m = L.marker(i, {
            icon: uncon
        }).addTo(map);

        currentCoords = i
    }
});


sendUnconUnfinished.onclick= async (e)=>{
    console.log(currentCoords)
    console.log(e.target.parentElement.children)

    //////check if exist then empty them 

    let children = e.target.parentElement.children
    if(children[2].files[0] && children[3].value && children[4].value && children[5].value){

        message.innerHTML = ""
        console.log(children[2].files)
        let fd = new FormData()
        fd.append("coords", currentCoords)
        // Object.values(children[2].files).forEach(e=>console.log("1", e))
        Object.values(children[2].files).forEach(e=>{
            fd.append("unconUnfinishedImgs", e)
        })
        fd.append("name", children[3].value)
        fd.append("userName", children[4].value)
        fd.append("smType", children[5].value)

        ///send 
        await fetch("/unconUnfinished", {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fd)

        })


        ////empty 
    
        children[2].files = null
        children[3].value = ""
        children[4].value = ""
        // children[5].value = ""
    }else{
        message.innerHTML = "fill the rest input"
    }
}


sendUnconFinished


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

    let d = await fetch("/con-finished")
    let pd = d.json()

    pd.forEach(e=> {
        ////e.imgs, e.
    });


    /////get con-unfinished; use red pin, current imgs

}






/////insert data 

////send data 




