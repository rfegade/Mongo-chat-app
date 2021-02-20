var express = require('express')
var http = require('http')
var socketio = require('socket.io')
var timeAgo = require('node-time-ago');
var fs = require('fs')
var path = require('path')
var myBuffer = Buffer.alloc(2048)

var {getAllUsernames, getAllUsers, getUserName,getRoomName, addUser, removeUser, getSocketId, getTimeOfJoining} = require("./util/users") // destructuring of the object
var {addMessageToDb, getMessages}  =require("./util/message")
const PORT = 3003

var app = express()
var server = http.createServer(app)
var io = socketio(server)

app.use(express.static("public"))

    // whenever new client connects
    io.on("connection", (socket)=>{
        // Welcome to the new user
        socket.on("joinChatRoom", (obj)=>{
            addUser(obj,socket,(p1)=>{
                if(p1 == true) {
                    socket.emit("message", {from: "Admin", msgDetails:"Welcome "+obj.userName+" to "+obj.roomName+" room"})
                    socket.join(obj.roomName)
                    // send message to db
                    var tempObj = {
                        fromUser: "Admin",
                        message: "A new user " +obj.userName+"has joined",
                        messageTime: new Date(),
                        toUser: "Public"
                    }
                    addMessageToDb(tempObj, (flag)=>{
                        if(flag == true){
                            socket.to(obj.roomName).broadcast.emit("message", {from:"Admin", msgDetails:`A new user ${obj.userName} has joined`})
                            getAllUsernames(obj.roomName, io)   
                        } 
                    })
                }
            })
            
        })
        // whenever a user sends a message
        socket.on("chatMessage", (obj)=>{
            var tempObj = {
                fromUser: obj.userName,
                message: obj.message,
                messageTime: new Date(),
                toUser: "Public"
            }
            addMessageToDb(tempObj, (flag)=>{
                if(flag == true){
                    io.to(obj.roomName).emit("message", {from: obj.userName, msgDetails: obj.message})
                } 
            })
        })

        // Whenever user sends a private message

        socket.on("chatMessagePrivate", (obj)=>{
            console.log(obj)
            var tempObj = {
                fromUser: obj.userName,
                message: obj.message,
                messageTime: new Date(),
                toUser: obj.toUserName
            }
            addMessageToDb(tempObj, (flag)=>{
                if(flag == true){
                    getSocketId(obj.roomName, obj.toUserName, (p1)=>{
                        socketId = p1
                        io.to(socketId).emit("privateMessage", {from: obj.userName, msgDetails:obj.message})
                    })
                    io.to(socket.id).emit("privateMessage", {from: obj.userName, msgDetails:obj.message})
                } 
            })
        })

        // download Chat

        socket.on("downloadChat", (obj)=>{
            getTimeOfJoining(obj.userName,obj.roomName, (t1)=>{
                var dateOfJoining = t1
                getMessages(dateOfJoining,(result)=>{
                    var fileUrl = path.join(__dirname,"public","download.txt")
                    
                    myBuffer.write(JSON.stringify(result))
                    fs.writeFile(fileUrl, myBuffer , (err)=>{
                        if(!err){
                            socket.emit("sendFile",{fileUrl:"/download.txt"})
                        }
                    })
                })
            })
        })

        // whenever a user leaves

        socket.on("disconnect",()=>{
            getUserName(socket.id,(p1)=>{
                userName = p1
                getRoomName(socket.id, (p1) => {
                    roomName = p1
                    var tempObj = {
                        fromUser: "Admin",
                        message: userName+" has left the Room",
                        messageTime: new Date(),
                        toUser: "Public"
                    }
                    addMessageToDb(tempObj, (flag)=>{
                        if(flag == true){
                            socket.to(roomName).broadcast.emit("message",{from:"Admin", msgDetails: `${userName} has left the Room`})
                            removeUser(socket.id, (flag)=>{
                                if(flag == true){
                                    getAllUsernames(roomName,io)     
                                }                  
                            })
                        } 
                    })
                    // socket.to(roomName).broadcast.emit("message",{from:"Admin", msgDetails: `${userName} has left the Room`})
                    // removeUser(socket.id)
                    //getAllUsernames(roomName,io)
                    //io.emit("usersList",getAllUsernames(roomName))        
                })    
            })
        })
    })

server.listen(PORT, (err)=>{
    if(!err){
        console.log(`Server is running at ${PORT}`);
    }
})