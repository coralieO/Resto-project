const discussion = document.getElementById('Chat');
const divMessage = document.getElementById('msglog');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('onlineUsersSelector');


// Get username and room from URL
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const  username  = urlParams.get('username');
const room = urlParams.get('room');
console.log(username, room)
const socket = io();


socket.on('message', message => {
    outputMessage(message);
    console.log(message)
    divMessage.scrollTop = divMessage.scrollHeight;
})


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

function success(pos) {
    var maPosition = pos.coords;
    var lat = maPosition.latitude;
    var lng = maPosition.longitude
   // socket.emit("position",{lat ,lng});
   //join chatroom
   p =new L.Marker([lat,lng],{icon: darkIcon}).addTo(map);
   var popup = L.popup()
   .setLatLng([lat,lng])
   .setContent("tu es ici")
   .openOn(map);

    socket.emit('join room',{username, room,lat,lng});
}
navigator.geolocation.getCurrentPosition(success);


//var value = listeRestos.value ;

// function changeResto(id){
//     const index = restos.findIndex(user => user.id === id);

//     if (index !== -1) {
//       return restos.splice(index, 1)[0];
//     }
// }
rdv = {"lieu":"tour eiffel","lat": 48.85849707026087,"lng": 2.294416910572021 }

//Rendez-vous

for(r in rdv){
    latitude = rdv.lat
    longitude = rdv.lng
    new L.Marker([latitude,longitude],{icon: redIcon}).addTo(map);    
}

function update() {
    const listeRestos = document.getElementById('listeRestos');
    var value = listeRestos.options[listeRestos.selectedIndex].value

    console.log(value)
    if (value == "Coréen"){
        var latr = 48.84558086369295;
        var lngr= 2.3121598422840486;
        var r= "Coréen";
        var color = '#ff6f7d';
        console.log('1')

        socket.emit('resto',{username,r,latr,lngr})
        resto =new L.Marker([latr,lngr]).addTo(map);
             
    
        var r = new L.LatLng(latr,lngr);
        var rdv = new L.LatLng(48.85849707026087, 2.294416910572021);
        var point = [r, rdv];
            console.log(rdv)
        var firstpolyline = new L.Polyline(point, {
            color: 'orange',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });
        firstpolyline.addTo(map);

    }
    if (value == "Africain"){
        var latr = 48.865364034631384;
        var lngr= 2.3776820520705555;
        var color = '#2bfafa';
        var r= "Africain";
        console.log('2')

        socket.emit('resto',{username,r,latr,lngr})
        resto =new L.Marker([latr,lngr]).addTo(map);
           
        var r = new L.LatLng(latr,lngr);
        var rdv = new L.LatLng(48.85849707026087, 2.294416910572021);
        var point = [r, rdv];
            console.log(rdv)
        var firstpolyline = new L.Polyline(point, {
            color: 'purple',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });
        firstpolyline.addTo(map);
    }
    if (value == "Mexicain"){
        var latr = 48.866538452030525;
        var lngr= 2.370051171194163;
        var color = '#009082';
        var r= "Mexicain";
        console.log('3');

        socket.emit('resto',{username,r,latr,lngr})
        resto =new L.Marker([latr,lngr]).addTo(map);
           
        var r = new L.LatLng(latr,lngr);
        var rdv = new L.LatLng(48.85849707026087, 2.294416910572021);
        var point = [r, rdv];
            console.log(rdv)
        var firstpolyline = new L.Polyline(point, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });
        firstpolyline.addTo(map);
    }
    
}








socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
})


discussion.addEventListener('submit', function(e) {
    e.preventDefault();
    msg = e.target.elements.chatMessageInput.value;
//     msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

  // Emit message to server
  socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('#msglog').appendChild(div);


};

function outputRoomName(room){
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML =` {
        ${users.map(user=> `<option>${user.username}</option>`)}
    }`
    // users.forEach((user) => {
    //   const option = document.createElement('option');
    //   option.innerText = user.username;
    //   userList.appendChild(option);
    // });
  }

//Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//     const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//     if (leaveRoom) {
//       window.location = '../index.html';
//     } else {
//     }
//   });




var positions =[
    {
        "name": "fifi",
        // "resto":{"lieu":"Coréen","lat": 48.84558086369295,"lng":2.3121598422840486,'color': '#ff6f7d'},
        "boulot":{"lieu":"AXA","lat": 48.86789313917533,"lng":2.369289395184737},
    },
    {   
        "name":"coco",
        //"resto":{"lieu":"Africain","lat": 48.865364034631384,"lng":2.3776820520705555,'color': '#2bfafa' },
        "boulot":{"lieu":"LCL","lat": 48.8710258641749,"lng":2.361178393354292},
    },
   {
        "name": "dona",
        //"resto":{"lieu":"Mexicain","lat": 48.866538452030525,"lng": 2.370051171194163,'color': '#009082' },
        "boulot":{"lieu":"ALLIANZ","lat": 48.86763662590795,"lng":2.35532819988727 }
    }
]

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



