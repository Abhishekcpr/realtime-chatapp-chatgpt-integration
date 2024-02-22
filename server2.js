// handling request from chatgpt :

const express = require('express')
const  dotenv =  require('dotenv') 
const app2  = express()
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()



const genAI = new GoogleGenerativeAI(process.env.API_KEY);



// console.log(process.env.OPEN_API_KEY);

const cors= require('cors')
const port = process.env.PORT || 3000

app2.use(cors())
app2.use(express.json())

app2.get('/', async(req,res)=>{
    res.status(200 ).send({
        message : "Now I am here"
    })

    


}) ;

app2.post('/', async(req,res)=>{
    try {
        const prompt = req.body.prompt;
        console.log(prompt);
        
    
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    
        res.status(200).send({
          bot: text
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