const users = [];
const restos = [];

function userJoin(id,username,room,latitude,longitude){
    const user = {id,username,room,latitude,longitude};
    console.log(user)
    users.push(user);
    return user;
}
function userResto(id,username,latr,lngr){
    const userResto = {id,username,latr,lngr};
    console.log(userResto)
    users.push(userResto);
    return userResto;
}


//récuperer un utilisateur

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// avoir la salle de l'utilisateur

function getRoomUsers(room){
    return users.filter(user =>user.room === room)
}

//un utilisateur s'en va
function userleave(id){
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
}

module.exports = { 
    userJoin,
    getCurrentUser,
    userleave,
    getRoomUsers
}