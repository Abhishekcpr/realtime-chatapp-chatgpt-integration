var socket = io.connect()

var username
var myID ;
var messagecontent
var sound = document.getElementById("sent") ;
var messageContent
var isPrivate = false 

var privateChat = []

// var allUsers = []
// var Status = document.getElementById("status").innerHTML
do{
     username = prompt("Enter your name")

}while(!username);

if(username)
{
    messagecontent = {
        user : username ,
        ID : generateID()
    }

    myID = messagecontent.ID ;
    socket.emit('user-data', messagecontent) ;

    addPerson(messagecontent.user,messagecontent.ID ) ;
}
document.getElementById("insert").addEventListener('keyup',(e)=>{
    // e.preventDefault()

   
    
    if(e.keyCode === 13)
    {
        console.log("something");
        content = document.getElementById("insert").value
        document.getElementById(myID).innerHTML = "online"
        socket.emit('not-typing',myID) ;

         messageContent = {
            user : username,
            sandesh : content ,
            ID : myID,
            isPrivate

           
        }

        // for public chat :
        if(!isPrivate)
        {
            socket.emit('message', messageContent)
        }
        else
        {
            socket.emit('private-message', messageContent,privateChat)
        }



        appendMessage((content),"me")
        document.getElementById("insert").value = ""
    }
    else
    {
        socket.emit('typing',myID) ;
    }
})


document.getElementById("send").addEventListener('click', (e)=>{

    // console.log("something");
        content = document.getElementById("insert").value
        document.getElementById(myID).innerHTML = "online"
        socket.emit('not-typing',myID) ;

         messageContent = {
            user : username,
            sandesh : content ,
            ID : myID,
            isPrivate

           
        }


       
        if(!isPrivate)
        {
            socket.emit('message', messageContent)

        }
        else
        {
            socket.emit('private-message', messageContent, privateChat)
        }

        appendMessage((content),"me")
        document.getElementById("insert").value = ""
})




function generateID()
{
    return `${ "UNI"  + Date.now() }`
}

function uniqueIDForChats()
{
    return `${ "GUPT"  + Date.now() }` 
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0:00) case
  
    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;
  
    const timeString = hours + ':' + minutes + ' ' + amOrPm;
    return timeString;
  }
   

function appendMessage(content, sender, privacy)
{
  
    messageDiv = document.createElement('p') ;
    messageDiv.setAttribute('id',uniqueIDForChats())


    if(sender === "me")
    {
  messageDiv.classList.add("chat-message", "chat-sent")
  messageDiv.innerHTML = `<span class='1'></span><span class='2'></span><span class='3'></span><span class="text">${content}</span> <span class='chat-timestamp'>${getCurrentTime()}</span>`    
 
    }

    
    else
    {
        
        messageDiv.classList.add("chat-message") 

       
        messageDiv.innerHTML = `<span id="username">~ ${sender}${(privacy ? " (private chat)" : "")}</span><br> <span class="text">${content}</span><span class='chat-timestamp'>${getCurrentTime()}</span>
        <br>
       
        `
        

    }

  

    messageContainer =  document.getElementById("messagebox")
   messageContainer.appendChild(messageDiv);

   messageContainer.scrollTop = messageContainer.scrollHeight




}


function addPerson(name,ID)
{
   var joinedUser =  document.getElementById("online") ;
   
   var onlineDiv = document.createElement('div')
   onlineDiv.classList.add('sidebar-chat') 

   onlineDiv.setAttribute('id',("a" + ID)) ;
   
   onlineDiv.innerHTML  = `  
   <div class="chat-avatar" >
       <img src="avatar${Math.floor(Math.random()*6 + 1) + ""}.jpg" alt="">
   </div>
   <div class="chat-info">
       <h4>${name}</h4>
       <p  id="${ID}">${"online 🟢"}</p>
   </div>
   <div class="time">
       <p>${getCurrentTime()}</p>
   </div>
`


joinedUser.appendChild(onlineDiv) ;
}


socket.on('user-data',(messageContent)=>{
    
   var connectedUser = document.getElementById("online") ;
   connectedUser.innerHTML = "";

    //  allUsers.push({
    //    user : messageContent.user,
    //    ID : messageContent.ID 
    //  })
    console.log(messageContent)
    for(let person of messageContent)
    {

        addPerson(person.user, person.ID) ;

    }
})

// when you receive a  message :
socket.on('message',(content)=>{
 
   sound.play()
    appendMessage(content.sandesh,content.user,content.isPrivate); 

})

socket.on('private-message',(content)=>{
 
    sound.play()
     appendMessage(content.sandesh,content.user, content.isPrivate); 
 
 })





socket.on('typing', (myID)=>{
     document.getElementById(myID).innerHTML = "typing..."
    // status.innerHTML = `${username} is typing...
})

socket.on('not-typing', (myID)=>{
    document.getElementById(myID).innerHTML = "online 🟢" ;
   // status.innerHTML = `${username} is typing...
})


socket.on('left',(leftID)=>{

    console.log(leftID + " diconnect");
   offline =   document.getElementById(leftID).innerHTML = "offline ⭕"
  
}) ;

// selecting messages for private chat :
const userContainer = document.getElementById("online");

userContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("sidebar-chat")) {
    var userID = event.target.id;
   

   var element =  document.getElementById(userID);

//  
     
     userID = userID + ""
     userID = userID.substring(1)
      
     if(privateChat.includes(userID))
     {
        index = privateChat.indexOf(userID) ;
        privateChat.splice(index,1) ; 

        element.style.backgroundColor = "#ffffff";
       
     }
     else
     {
        privateChat.push(userID) ; 
        element.style.backgroundColor = "rgb(198, 232, 224)";
      
     }

     if(privateChat.length == 0)
     {
        isPrivate = false ;
     }
     else
     {
        isPrivate = true ;
     }

    

   
     
  
  }
})
// translating and summarizing code :


var messageText = null  ;
var loadInterval ;
var addQuery = ""
const chatContainer = document.getElementById("messagebox");

chatContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("chat-message")) {
    const messageId = event.target.id;

    document.getElementById(messageId).style.backgroundColor = '#e6e68e'
    console.log("container:", document.getElementById(messageId).childNodes[3].innerHTML);
    // console.log("container:", document.getElementById(messageId).childNodes);
    
    messageText = document.getElementById(messageId).childNodes[3] ;


      addQuery = prompt("What to do ? (Click on T button below for response)") ;

     
    document.getElementById("getdata").value =  addQuery  + " : " + messageText.innerHTML ;

    console.log("message received" +  document.getElementById("getdata").value);

     
   
    

  }
});

form = document.querySelector('form')

// form.addEventListener('submit',handleRequest)

form.addEventListener('submit', (e)=>{

  
    e.preventDefault();
   
    if(messageText!= null && addQuery!= "")
    {
        addQuery = ""
        handleRequest(e) ;
    }
}) ;





// generate loading  dots 
function loader(element)
{
    element.textContent = ''

  loadInterval =   setInterval(() => {
     
    if(element.textContent !== '....')
    element.textContent += '.'

    else
    element.textContent = ''

    }, 300);
}

handleRequest = async(e)=>{
    e.preventDefault()
    let data = new FormData(form) ;
    console.log(data.get('prompt')) ;
    form.reset() ;
    loader(messageText)

        // fetching data from server :
        const response = await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: data.get('prompt')
            })
        })
    
        clearInterval(loadInterval) ;
        messageText.innerHTML = ''
        if(response.ok)
        {
            const data  = await response.json()
            const parsedData = data.bot.trim()
            
            console.log(parsedData);
            navigator.clipboard.writeText(parsedData)
           messageText.innerHTML = parsedData ;
        }
        else
        {
            const err = await response.text();
            // typeContent(messageDiv, "Something went wrong...") ;
            alert(err) ; 
        }

}














