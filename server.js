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


 
// handling request from chatgpt :

const  dotenv =  require('dotenv') 
const app2  = express()

require('dotenv').config()
// console.log(process.env) 
const {Configuration, OpenAIApi}  = require('openai') 
// dotenv.config() ;


const configuration = new Configuration({
    // apiKey : process.env.OPEN_API_KEY,
    apiKey : process.env.OPEN_API_KEY

})



console.log(process.env.OPEN_API_KEY);

const openai = new OpenAIApi(configuration)
const cors= require('cors')
const port = process.env.PORT || 3000

app2.use(cors())
app2.use(express.json())

app2.get('/sure', async(req,res)=>{
    res.status(200 ).send({
        message : "Now I am here"
    })

    


}) ;

app2.post('/', async(req,res)=>{
    try {
        const prompt = req.body.prompt;
        console.log(prompt);
        
    
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          });
         
        console.log(response.data.choices[0].text)
    
        res.status(200).send({
          bot: response.data.choices[0].text
        });

    
      } 
    catch(err)
    {
        res.status(400).send("unable to connect...")
    }
})

app2.listen(port,(err)=>{
    if(!err)
    console.log(`server running at port ${port}`);
})


