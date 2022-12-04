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
    }
    if (value == "Africain"){
        var latr = 48.865364034631384;
        var lngr= 2.3776820520705555;
        var color = '#2bfafa';
        var r= "Africain";
        console.log('2')

        socket.emit('resto',{username,r,latr,lngr})
        
    }
    if (value == "Mexicain"){
        var latr = 48.866538452030525;
        var lngr= 2.370051171194163;
        var color = '#009082';
        var r= "Mexicain";
        console.log('3');

        socket.emit('resto',{username,r,latr,lngr})
    }
    
}



socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
})

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

distance =[]
socket.on('restoUsers', ({room,users,restos}) => {
       console.log(users)
       for (i=0;i<Object.keys(users).length;i++){
        lat =users[i].latitude
        lng =users[i].longitude
        userN=users[i].username
       }

        p =new L.Marker([lat, lng],{icon: darkIcon}).addTo(map);
        resto =new L.Marker([restos.latr, restos.lngr]).addTo(map);
        var popup = L.popup()
        .setLatLng([lat,lng])
        .setContent("tu es ici "+userN)
        .openOn(map);

        //distance
        distance1 = getDistance(restos.latr, restos.lngr,lat,lng);
        distance2 = getDistance(lat,lng,48.85849707026087,2.294416910572021);
        dist = {nom: userN, distance_1: distance1,distance_2:distance2};
        console.log(Object.values(dist))
        distance.push(dist);
        temps =[];
        for (i=0;i<Object.keys(distance).length;i++){
            if(distance[i].distance_1){
                t = ((distance[i].distance_1 +distance[i].distance_2)/5);
                temps.push({nom:distance[i].userN, temps: t});
            }
        }
        console.log(Object.values(temps))
        // outputTime(temps);

          
        var boulot = new L.LatLng(lat, lng);
        var resto = new L.LatLng(restos.latr, restos.lngr);
        var pointList = [boulot, resto];

            var firstpolyline = new L.Polyline(pointList, {
                //color: resto.color,
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
       firstpolyline.addTo(map);

       var rdv = new L.LatLng(48.85849707026087, 2.294416910572021);
       var point = [resto,rdv];

       var secondpolyline = new L.Polyline(point, {
        //color: resto.color,
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
        });
        secondpolyline.addTo(map);
})


discussion.addEventListener('submit', function(e) {
    e.preventDefault();
    msg = e.target.elements.chatMessageInput.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

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
// function outputTemps(temps){
//     roomName.innerText = room;
// }
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML =` {
        ${users.map(user=> `<option>${user.username}</option>`)}
    }`
   
  }

//Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//     const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//     if (leaveRoom) {
//       window.location = '../index.html';
//     } else {
//     }
//   });

