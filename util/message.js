var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var dbUrl = "mongodb://localhost:27017/";
function addMessageToDb(obj,callback){
    mongoClient.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            var myDb = dbHost.db("simplilearnDb");
            myDb.collection("messageStore",(err,myColl)=>{
                if(err){
                    console.log("Error connectiing to the collection", err);
                    callback(false)
    
                } else {
                    myColl.insertOne(obj,(err,result)=>{
                        if(err){
                            console.log("Error", err);
                        } else {
                            console.log("Result of the insert operation", result);
                            console.log("Number of document inserted : "+result.insertedCount);
                            console.log("Inserted Id : "+result.insertedId);
                            console.log("Inserted Doc" , result.ops);
                            callback(true)
                        }
                    })
                }
    
            })
        }
    })

}

function getMessages(dateOfJoining, callback){
    mongoClient.connect(dbUrl,{ useUnifiedTopology: true },(err,dbHost)=>{
        if(err){
            console.log("Error connecting to the server",err);
        } else {
            var myDb = dbHost.db("simplilearnDb");
            myDb.collection("messageStore",(err,myColl)=>{
                if(err){
                    console.log("Error connectiing to the collection", err);
                    callback(false)
    
                } else {
                    var obj = {messageTime:{$gt:dateOfJoining}}
                    myColl.find(obj,{projection:{_id:0}}).toArray((err,result)=>{
                        if(err){
                            console.log("Error", err);
                        } else {
                            console.log("Result of the insert operation", result);
                            console.log("Number of document inserted : "+result.insertedCount);
                            console.log("Inserted Id : "+result.insertedId);
                            console.log("Inserted Doc" , result.ops);
                            callback(result)
                        }
                    })
                }
    
            })
        }
    })
}
module.exports = {addMessageToDb, getMessages}