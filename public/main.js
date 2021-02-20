//var msgTime = require('time-ago.js') 
var pageHeading = document.getElementById("page-heading");
var chatMessages = document.getElementById("chatMessages")
function sendMessageEventHandler(){
    // trigger when user clicks on send button
    var txtMessage = document.getElementById("txtMessage").value;
    //alert("Thank you for sending the message " + txtMessage)
    document.getElementById("txtMessage").value = ""
    socket.emit("chatMessage",{userName:userName,message:txtMessage,roomName:roomName})
}


function sendMessagePrivatelyEventHandler(){
    var txtMessage = document.getElementById("txtMessagePrivate").value;
    var selectedIndex = document.getElementById("membersDd").selectedIndex;

    var toUserName = document.getElementById("membersDd").options[selectedIndex].value;

    console.log("To username" +toUserName)
    //alert("Thank you for sending the message " + txtMessage)
    document.getElementById("txtMessagePrivate").value = ""
    socket.emit("chatMessagePrivate",{userName:userName,message:txtMessage,roomName:roomName,toUserName:toUserName})

}

function downloadChat(){
    socket.emit("downloadChat",{userName:userName, roomName:roomName})
}

// get the query string
var obj = Qs.parse(location.search, {ignoreQueryPrefix:true}) // convert it into the json format // ignoreQueryPrefix:true - ignore question mark
//console.log(obj);
var userName = obj.txtUsername;
var roomName = obj.roomName;
console.log(userName)
pageHeading.innerHTML = roomName+" Room"

const socket = io();
socket.on("message", (obj)=>{
    var paraElement = document.createElement("p")
    var str1 = `${obj.from} : ${obj.msgDetails}`
    var textElement = document.createTextNode(str1)
    var timeElement = document.createElement("span")
    var msgTime = new Date()
    var spanElement = document.createTextNode(msgTime)
    paraElement.style.backgroundColor="#f5f5f5"
    paraElement.style.color = "black" 
    paraElement.style.border = "2px solid rgb(86, 101, 115)"
    paraElement.style.padding = "5px"
    paraElement.style.width = "70%"
    paraElement.style.borderRadius = "5px"
    paraElement.style.float = "left"
    paraElement.style.marginBottom = "0px"
    timeElement.style.width = "100%"
    timeElement.style.display = "flex"
    timeElement.style.marginBottom = "1rem"
    timeElement.style.fontSize = "12px"
    timeElement.style.color = "gray"

    if(obj.from == "Admin"){
        paraElement.style.backgroundColor="#566573" 
        paraElement.style.color = "white"
        paraElement.style.border = "2px solid black"
        paraElement.style.padding = "5px"
        paraElement.style.width = "100%"
        paraElement.style.borderRadius = "5px"
        paraElement.style.marginBottom = "0px"
        timeElement.style.flexFlow = "row-reverse"

    }

    if(obj.from == userName){
        paraElement.style.backgroundColor="#dce7ff" 
        paraElement.style.color = "black"
        paraElement.style.border = "2px solid #6583c8"
        paraElement.style.padding = "5px"
        paraElement.style.width = "70%"
        paraElement.style.borderRadius = "5px"
        paraElement.style.float = "right"
        paraElement.style.marginBottom = "0px"
        timeElement.style.flexFlow = "row-reverse"

    }
    paraElement.appendChild(textElement)
    chatMessages.appendChild(paraElement)

    // Add message time
    // let span = document.createElement("span");
    // chatMessages.appendChild(span).append("by " + "Anonymous" + ": " + "just now");
    timeElement.appendChild(spanElement)
    chatMessages.appendChild(timeElement)

    //Scroll down on new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
})

socket.on("privateMessage", (obj)=>{
    var paraElement = document.createElement("p")
    var str1 = `${obj.from} (Privately): ${obj.msgDetails}`
    var textElement = document.createTextNode(str1)
    var timeElement = document.createElement("span")
    var msgTime = new Date()
    var spanElement = document.createTextNode(msgTime)
    paraElement.style.backgroundColor="navy"
    paraElement.style.color = "white" 
    paraElement.style.border = "2px solid rgb(86, 101, 115)"
    paraElement.style.padding = "5px"
    paraElement.style.width = "70%"
    paraElement.style.borderRadius = "5px"
    paraElement.style.float = "left"
    timeElement.style.width = "100%"
    timeElement.style.display = "flex"
    timeElement.style.marginBottom = "1rem"
    timeElement.style.fontSize = "12px"
    timeElement.style.color = "gray"

    if(obj.from == userName){
        paraElement.style.backgroundColor="navy" 
        paraElement.style.color = "white"
        paraElement.style.border = "2px solid #6583c8"
        paraElement.style.padding = "5px"
        paraElement.style.width = "70%"
        paraElement.style.borderRadius = "5px"
        paraElement.style.float = "right"
        paraElement.style.marginBottom = "0px"
        timeElement.style.flexFlow = "row-reverse"

    }

    paraElement.appendChild(textElement)
    chatMessages.appendChild(paraElement)

    timeElement.appendChild(spanElement)
    chatMessages.appendChild(timeElement)

    chatMessages.scrollTop = chatMessages.scrollHeight;

})

socket.emit("joinChatRoom", {userName:userName, roomName:roomName})

socket.on("usersList", (usersArray)=>{
    var ulList = document.getElementById("userNamesUl")
    ulList.innerHTML = ""
    var selectList = document.getElementById("membersDd")
    selectList.innerHTML = ""
    for(var i = 0;i < usersArray.length;i++){
        var liElement = document.createElement("li")
        var textElement = document.createTextNode(usersArray[i])

        liElement.appendChild(textElement)
        ulList.appendChild(liElement)
    }
    for(var i=0; i<usersArray.length; i++){
        if(usersArray[i] != userName) {
            var optionElement = document.createElement("option")
            var textElement = document.createTextNode(usersArray[i])
            optionElement.appendChild(textElement)
            selectList.appendChild(optionElement)
        }
    }
})

socket.on("usernameExists",(obj)=>{
    location.href="/"
    //document.getElementById("errMessage").innerHTML = "Username Already Exists"
    alert("Username Already Exists")
})

socket.on("sendFile",(obj)=>{
    location.href = obj.fileUrl
})
// socket.emit --- only to that particular user
//io.emit --- all the users
// socket.broadcast.emit --- all other isers except that user