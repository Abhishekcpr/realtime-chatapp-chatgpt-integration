// handling request from chatgpt :

const express = require('express')
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



// console.log(process.env.OPEN_API_KEY);

const openai = new OpenAIApi(configuration)
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