///////////////////////////////////////////////////////////////////////
////setting up 

const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map
//tile layer
const apiKey = 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA';

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: apiKey
// }).addTo(map);

// L.Control.geocoder().addTo(map);


        ////////the required labels
        let oldIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        ////getting icon; icon is special object not just an image
        let markerIcon = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });




/////data containers

/////main elements 


/////getting data; fetch confirmed; finished, unifinished 
////display data; red and green labels and imgs; based on the ????

window.onload = async ()=>{

    //////get api key 
    let rApiKey = await fetch("/map-api-key")
    console.log(rApiKey)
    let apiKey = await rApiKey.json()
    console.log(apiKey)
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


