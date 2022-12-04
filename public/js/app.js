
let mapOptions = {
    center:[48.84558086369290,2.3121598422840486],
    zoom:5
}


let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);
var redIcon = L.icon({
    iconUrl: 'img/broche-de-localisation.png',
    iconSize:     [38, 38], // size of the icon
});

var darkIcon = L.icon({
    iconUrl: 'img/maps-and-flags.png',
    iconSize:     [38, 38], // size of the icon
});
//resto
var positions =[
    {
        "name": "fifi",
        "resto":{"lieu":"Coréen","lat": 48.84558086369295,"lng":2.3121598422840486,'color': '#ff6f7d'},
        "boulot":{"lieu":"AXA","lat": 48.86789313917533,"lng":2.369289395184737},
    },
    {   
        "name":"coco",
        "resto":{"lieu":"Africain","lat": 48.865364034631384,"lng":2.3776820520705555,'color': '#2bfafa' },
        "boulot":{"lieu":"LCL","lat": 48.8710258641749,"lng":2.361178393354292},
    },
   {
        "name": "dona",
        "resto":{"lieu":"Mexicain","lat": 48.866538452030525,"lng": 2.370051171194163,'color': '#009082' },
        "boulot":{"lieu":"ALLIANZ","lat": 48.86763662590795,"lng":2.35532819988727 }
    }
]
rdv = {"lieu":"tour eiffel","lat": 48.85849707026087,"lng": 2.294416910572021 }

//Rendez-vous

for(r in rdv){
    latitude = rdv.lat
    longitude = rdv.lng
    new L.Marker([latitude,longitude],{icon: redIcon}).addTo(map);    
}

for(position in positions){
    for(i=0;i<Object.keys(positions).length;i++){
       
        if(positions[i].boulot){
            latitude = positions[i].boulot.lat
            longitude = positions[i].boulot.lng
           boulot =new L.Marker([latitude,longitude],{icon: darkIcon}).addTo(map);
           
        }
        if(positions[i].resto){
            latitude = positions[i].resto.lat
            longitude = positions[i].resto.lng
            resto =new L.Marker([latitude,longitude]).addTo(map);
           // console.log(positions[i].resto)
        }
        
    }
    
    
        
}

distance =[];
for (i=0;i<Object.keys(positions).length;i++){
    if(positions[i].boulot){
        person = positions[i].name
        latitude = positions[i].boulot.lat
        longitude = positions[i].boulot.lng
        
        if(positions[i].resto){
            lat = positions[i].resto.lat
            lng = positions[i].resto.lng
            for(r in rdv){
                a = rdv.lat
                b = rdv.lng                   
            }
            var boulot = new L.LatLng(latitude, longitude);
            var resto = new L.LatLng(lat, lng);
            var pointList = [boulot, resto];

            var firstpolyline = new L.Polyline(pointList, {
                color: positions[i].resto.color,
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            firstpolyline.addTo(map);

            var resto = new L.LatLng(lat, lng);
            var rdv = new L.LatLng(a, b);
            var point = [resto, rdv];

            var firstpolyline = new L.Polyline(point, {
                color: 'orange',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            firstpolyline.addTo(map);
             
            distance1 = getDistance(latitude,longitude,lat,lng);
            distance2 = getDistance(lat,lng,a,b);
            //console.log(distance1,distance2);
            dist = {nom: person, distance_1: distance1,distance_2:distance2};
            distance.push(dist);
        } 
    }
        
}

temps =[];
for (i=0;i<Object.keys(distance).length;i++){
    if(distance[i].distance_1){
        t = ((distance[i].distance_1 +distance[i].distance_2)/5);
        temps.push({nom:distance[i].nom, temps: t});
    }
}
Lc = L.control.locate(
    {
        strings: {
            title: "Ta position",  // title of the locate control
            popup: "Tu es ici",  // text to appear if user clicks on circle
        }
    }
).addTo(map);



var marker;
map.on('locationfound', function(e){
    
    direct = {lat: e.latitude, lng: e.longitude}
    var lat = e.latitude ;
    var lng = e.longitude;
    socket.emit('positon',{lat ,lng});
    positions.push(direct);
})
positions.forEach(element => {
    console.log(element)
});


//calcul de distance
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg) {
return deg * (Math.PI/180)
}



