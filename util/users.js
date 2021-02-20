const mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var dbUrl = "mongodb://localhost:27017/";

var usersArray = []



function addUser(obj,socket,callback)
{
    var tempUser = {
        userName : obj.userName,
        roomName : obj.roomName,
        socketId:socket.id
    }
    usersArray.push(tempUser)
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            console.log("MongoDb is connected");
    
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    tempUser.dateOfJoining = new Date();
                    var queryDoc = {userName:tempUser.userName, roomName:tempUser.roomName}
                    myColl.findOne(queryDoc,(err,result)=>{
                        if(err){
                            console.log("Error during the read Op");
                        } else {
                            if(result){
                                console.log("UserName Already taken");
                                socket.emit("usernameExists",{message: "Username Already Exists"})
                            } else {
                                myColl.insertOne(tempUser,(err,result)=>{
                                    if(err){
                                        console.log("Error inserting the document");
                                    } else {
                                        console.log("Document inserted successfully");
                                        callback(true)
                                    }
                                })
                            }
                        }
                    })
                    
                }
            })
        }
    })
}

function getAllUsers()
{
    
    //find method {roomaname}
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    myColl.find({}).toArray((err,result)=>{
                        if(err){
                            console.log("Error finding the documents", err);
                        } else {
                            console.log("Document Result: ", result);
                            return result;
                        }
                    })
                }
            })
        }

    })
    //return usersArray()
}

function getAllUsernames(roomName, io)
{
    // var tempUserArray = usersArray.filter(item=> item.roomName == roomName)
    // var userNameArray = tempUserArray.map(item=> item.userName)

    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    myColl.find({roomName:roomName},{projection:{userName:1}}).toArray((err,result)=>{
                        if(err){
                            console.log("Error finding the documents");
                        } else {
                            console.log("Document Result: ", result);
                            var nameArray = result.map(item => item.userName)
                            io.to(roomName).emit("usersList",nameArray)
                            //return result;
                        }
                    })
                }
            })
        }

    })

    //return userNameArray
    //find method {roomaname{projection:{username:1}}},()={}
}

function getRoomName(id, callback)
{
    // var userDetail = usersArray.find(item => item.socketId == id)
    // return userDetail.roomName
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    myColl.findOne({socketId:id},{projection:{roomName:1}},(err, result)=>{
                        if(err){
                            console.log("Error finding the document", err);
                        } else {
                            console.log("Document result:", result);
                            callback(result.roomName)
                        }
                    })
                }
            })
        }
    })
}
function getUserName(id, callback)
{
    // var userDetail = usersArray.find(item => item.socketId == id)
    // return userDetail.userName
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    myColl.findOne({socketId:id},{projection:{userName:1}},(err, result)=>{
                        if(err){
                            console.log("Error finding the document", err);
                        } else {
                            console.log("Document result", result);
                            callback(result.userName)
                        }
                    })
                }
            })
        }
    })
}

function removeUser(id, callback){
    // var pos = usersArray.findIndex(item => item.socketId == id)
    // usersArray.splice(pos,1)
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
            callback(false)
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                    callback(false)
                } else {
                    myColl.deleteOne({socketId:id},(err, result)=>{
                        if(err){
                            console.log("Error finding the document", err);
                            callback(false)
                        } else {
                            callback(true)
                            console.log("Document is deleted");
                        }
                    })
                }
            })
        }
    })

}

function getSocketId(roomName, userName, callback){
    // var user = usersArray.find(item => {
    //     if((item.roomName == roomName) && (item.userName == userName))
    //     {
    //         return true;
    //     } 
    // })
    // return user.socketId
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    myColl.findOne({roomName:roomName, userName:userName},{projection:{socketId:1,_id:0}},(err, result)=>{
                        if(err){
                            console.log("Error finding the document", err);
                        } else {
                           callback(result.socketId)
                        }
                    })
                }
            })
        }
    })
}

function getTimeOfJoining(userName, roomName, callback){
    mongo.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            db=dbHost.db("simplilearnDb")
            db.collection("users",(err,myColl)=>{
                if(err){
                    console.log("Error connecting to the collection", err);   
                } else {
                    myColl.findOne({roomName:roomName, userName:userName},{projection:{dateOfJoining:1,_id:0}},(err, result)=>{
                        if(err){
                            console.log("Error finding the document", err);
                        } else {
                           callback(result.dateOfJoining)
                        }
                    })
                }
            })
        }
    })
}
module.exports = {getAllUsernames, getAllUsers, getUserName, getRoomName, addUser, removeUser, getSocketId, getTimeOfJoining}

