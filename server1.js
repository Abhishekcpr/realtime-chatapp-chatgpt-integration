const express = require('express')
const app1 = express()
const http = require('http').createServer(app1)

const PORT1 = process.env.PORT || 8000

http.listen(PORT1, () => {
    console.log(`Listening on port ${PORT1}`)
})

app1.use(express.static(__dirname + '/public'))

app1.get('/', (req, res) => {
    res.sendFile(__dirname +'/public' +  '/index.html')
})

// const secureKey = 9211 ;
// Socket 
const io = require('socket.io')(http)


// store player names : (must be unique)

const players = []
block = false ;
var turn = 0
io.on('connection', (socket) => {
    console.log('A user connected ...');

   

    socket.on('user-data',(content)=>{
        console.log(content.user + ' joined ');
        players.push({
            serverID : socket.id ,
            clientID : content.ID,
            name : content.user 
        })                     

         console.log({
            serverID : socket.id ,
            clientID : content.ID,
            name : content.user 
        })
        // players[socket.id] = content.user ;
        // players.push(content.user); 
        
         
        console.log(socket.id);
         
        socket.broadcast.emit('user-data',content) ;
    })

  
    socket.on('message',(content)=>{
     
        socket.broadcast.emit('message',content) ;
    })
    socket.on('disconnect',()=>{

        
        console.log(`  disconnected ...`);



        for (let player of players) {
            if (player.serverID === socket.id) {
              socket.broadcast.emit('left', player.clientID);
              console.log(player);
              break; // assuming there is only one matching player, we can break out of the loop once we find it
            }
          }
          
        
        // console.log(players);

    })

    

    socket.on('typing',(content)=>{

        
        socket.broadcast.emit('typing',content) ;
    })

    socket.on('not-typing',(content)=>{
      
        socket.broadcast.emit('not-typing',content) ;
    })

    


})


 



