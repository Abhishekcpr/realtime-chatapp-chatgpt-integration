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

const allUsers = []
const players = []
block = false ;

const socketArray = []
check = true
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

       
            // console.log(socketArray[0] + "this one");
        

         console.log({
            serverID : socket.id ,
            clientID : content.ID,
            name : content.user 
        })


        socketArray.push(socket) ; 
        
        
        allUsers.push({
            user : content.user,
            ID : content.ID
        })


        // players[socket.id] = content.user ;
        // players.push(content.user); 
        
         
        console.log(socket.id);
         
        socket.broadcast.emit('user-data',allUsers) ;
        socket.emit('user-data',allUsers )
        
    })

  
    socket.on('message',(content)=>{
        
        socket.broadcast.emit('message',content) ;
        // socketArray[2].emit('message',content) ;
      

       
    })

    // receiving and sending private chats 
    socket.on('private-message',(content,members)=>{

        console.log("privacy activated");
        // console.log(members);
        // console.log(players);

        // socketArray[1].broadcast.emit('private-message',content) ;
        for(var i = 0; i< members.length; i++)
        {
             var x = members[i]

             for(var y = 0; y < allUsers.length; y++)
             {
                if( players[y].clientID == x)
                {   
                    console.log(socketArray[y].id + " " + players[y].serverID);
                   socketArray[y].emit('private-message',content) ;
                }  
             }
        }
       
         

       
    })


    socket.on('disconnect',()=>{

        
        console.log(`  disconnected ...`);



        for (let player of players) {
            if (player.serverID === socket.id) {
              socket.broadcast.emit('left', player.clientID);

               
              console.log(player);

               for(i = 0; i < allUsers.length; i++)
               {
                 if(allUsers[i].ID == player.clientID)
                 {
                    allUsers.splice(i,1) ; // remove user data form array
                    socketArray.splice(i,1); // remove socket form array
                    break ;
                 }
               }
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


 



