MongoDB

db.emp.insertMany([{empId:110,empName:"Ryan", salary:67463},
{empId:111,empName:"Bryan", salary:64758},
{empId:112,empName:"Ben", salary:74635}])

db.emp.insertOne({empId:113,empName:"Kevin", salary:54637, deptId:"D2"})

// Return all documents in the collection
db.emp.find()

//select * from emp where empId = 101
db.emp.find({empId:101})

//select * from emp where salary > 50000
db.emp.find({salary:{$gt:50000}})

operators = $gt, $lt, $gte, $lte, $ne, $eq

db.emp.find({salary:{$lt:1000}}) //less that 10000
db.emp.find({empId:{$eq:101}}) //empId = 101

// Logical operators
AND, or, not

//And -- sal>1000 and deptId="D1"
db.emp.find({
    $and:[{salary:{$gt:10000}},{deptId:"D1"]
})

//Or - sal>1000 or deptId="D1"
db.emp.find({
    $or:[{salary:{$gt:10000}},{deptId:"D1"]
})

db.emp.find({
    $or:[{empId:{$eq:109}},{salary:{$gt:5000}}]
})

// AND
db.emp.find({
    $and:[{empId:{$eq:109}},{salary:{$gt:5000}}]
})

// get all docs for which sal is in the range 3000 to 7000
// between operator in sql
db.emp.find({
    {salary:{$gt:3000, $lt:7000}}
})

// In operator - all docs for whicj empId is either 101,103,105,107,109
db.emp.find({
    empId:{$in:[101,103,105,107,109]}
})

// not in operator
db.emp.find({
    empId:{$nin:[101,103,105,107,109]}
})

$gt,$gte,$lt,$lte,$eq,$neq,$in,$nin,$and,$or,$not,$type,$exists

db.emp.find({salary:null}) //display all with salary is null and who doesn't have sal

db.emp.find({salary:{$exists:false}}) // docs for which sal field is missing


db.emp.find({salary:{$type:10}}) // docs for which sal field is exist and it is null

BSON data types have a corresponding $type,  ex: null = 10

get all docs where _Id is Object Id
db.emp.find({_id:{$type:7}})

get all docs where _Id is other than Object Id
db.emp.find({_id:{$not:{{$type:7}}})


db.emp.find({empId:{$gt:105}}, {empName:1,salary:1,_id:0})

db.emp.find({empId:{$gt:105}}, {empName:1,salary:1,_id:0}).count()
count gives number of document

db.emp.find({empId:{$gt:105}}, {empName:1,salary:1,_id:0}).limit(5) // will print only first 5 document

db.emp.find({empId:{$gt:105}}, {empName:1,salary:1,_id:0}).skip(5) // skip first 5 dics and print rest


// both same
db.emp.find().skip(5).limit(5)
db.emp.find().limit(5).skip(5)
perforns skip first and then limit

// sort
db.emp.find().sort({salary:1}) // asc
db.emp.find().sort({salary:-1}) // desc

db.emp.find().sort({empId:1, empName:1}) // sort with multiple fields

// Object Id
ObjectId("600daa0a959eb75d0eddb1f9")

a 4-byte timestamp value, representing the ObjectId’s creation, measured in seconds since the Unix epoch
a 5-byte random value - process Id
a 3-byte incrementing counter, initialized to a random value

last few values are incrementing counter


// Zipcode collection

db.zipcode.find({loc:[-72.936114,42.182949]})

db.zipcode.find({loc:{$gt:40}}) // either of the values in the loc array should be gt than 40

db.zipcode.find({"loc.0":{$gt:40}}) // 0th element should be greater than 40

// Embeded objects - working with restaurant data

{"address.street":/ave/i} /// get the docs where in street it has "ave string" and it ignore the case

{"address.coord":[-73.856077,40.848447]} // get exact these coord


// students data

db.students.insertMany([
{studId:101,studName:"sara",marks:[{standard:6,grades:6.7},{standard:7,grades:7.7},{standard:8,grades:6.7}]},
{studId:102,studName:"tara",marks:[{standard:6,grades:9.7},{standard:7,grades:8.7},{standard:8,grades:9.7}]},
{studId:103,studName:"lara",marks:[{standard:6,grades:7.7},{standard:7,grades:9.9},{standard:8,grades:8.7}]},
{studId:104,studName:"piyush",marks:[{standard:6,grades:6.7},{standard:7,grades:7.7},{standard:8,grades:5.7}]},
{studId:105,studName:"danny",marks:[{standard:6,grades:7.7},{standard:7,grades:5.7},{standard:8,grades:4.7}]},
])

db.students.insert([
{studId:106,studName:"geet",marks:[{standard:6,grades:4.7},{standard:7,grades:9.7},{standard:8,grades:6.7}]},
])
db.students.find({"marks.grades":{$gt:7.5}})

db.students.find({
    $and:[
        {"marks.standard":6},{"marks.grades":{$gt:7.5}}
    ]
})

one element in marks array can have a grade gt 7.5 and one another or same element should have standard = 6
Ans: 101,102,103,104,105

db.students.find({
    marks:{$elemMatch:{
        $and:[{grades:{$gt:7.5},{standard:6}}]
    }
})

db.students.find({
    marks:{
        $elemMatch:{grades:{$gt:7.5},{standard:6}}
    }    
})

db.students.find({
    $and:[
        {"studName":/a/},{"marks.grades":{$gt:7.5}}
    ]
})

db.students.find({
    $or:[
        {"studName":/y/},{"marks.grades":{$gt:9}}
    ]
})

// 0th element
db.students.find({
    "marks.0.grades":{$gt:9}
})

db.students.find({
    "marks":{$elemMatch:{grades:{$gt:7.1,$lt:7.9}}}
})

db.students.find(
    {"marks.grades":{$gt:8}},{"marks.$":1,_id:0,studId:1}
)


// delete

 db.emp.deleteOne({empId:101})
{ "acknowledged" : true, "deletedCount" : 1 }
> db.emp.deleteMany({salary:{$gt:3000,$lt:5000}})
{ "acknowledged" : true, "deletedCount" : 1 }
> 


// update

two param , 1. search criteria, 2. how to update
update,updateOne, updateMany
db.emp.updateOne({empId:104},{deptId:"D12",empName:"Bheem"})

db.emp.updateOne({empId:104},{$set:{salary:1000}})

$inc - increment it by the number given
db.emp.updateOne({empId:107},{$inc:{salary:1000}}) // increament sal by 1000
db.emp.updateOne({empId:107},{$inc:{salary:-1000}}) // decreament sal by 1000

$unset - remove existing field

db.emp.updateOne({empId:107},{$unset:{deptId:1}})

// $push
db.emp.update({empId:110},{$push:{hobbies:"singing"}})

//each
db.emp.update({empId:110},{$push:{hobbies:{$each:["coding","treking","cycling"]}}})


db.emp.update({empId:103},{$push:{"projects":{$each:["p1","p2","p3"]}}})
db.emp.update({empId:103},{$push:{"projects":{$each:["p1","p3","p5"]}}})

// pull - removed all instances that satisfy the condition
db.emp.update({empId:110},{$pull:{"hobbies":"gymming"}})

// pull - removed all instances that satisfy the condition -  removes multiple items
db.emp.update({empId:110},{$pullAll:{"hobbies":["gymming","cycling"]}})

// pop - removed last or first value
db.emp.update({empId:110},{$pull:{"hobbies":1}})

// Add tandard 9 with grade 7.6 for studId 101
db.students.update({studId:101},{$push:{"marks":{"standard":9,"grades":7.6}}})


// remove an array element which has a standard 8 in studId:101
db.students.update({studId:101},{$pull: {"marks":{"standard":8}}})


// Remove the first element for all the docs

db.students.updateMany({},{$pop:{"marks":-1}}) 

db.students.update({},{$pop:{"marks":-1}},{multi:true})

// Aggregation Pipeline
db.find does not work with aggregation operators

db.zipcode.aggregate([
{$match: {
  pop:{$gt:10000}
}},
{$project: {
  city:1,
  pop:1,
  state:1,
  _id:0,
  country:"USA",
  "state_city":{$concat:["$state","_","$city"]},
  newState:{$toLower:"$state"},
  shortCity:{$substr:["$city",0,3]},
  latitude:{$arrayElemAt:["$loc",0]},
  longitude:{$arrayElemAt:["$loc",1]},


    }}])


//select max(pop) from zipcode
db.zipcode.aggregate(
    [{
    $group: {
        _id: null,
        MaxPOP: {
            $max: "$pop"
        }
    }
}, {
    $project: {
        _id: 0
    }
}]
)


select min(pop) from zipcode
db.zipcode.aggregate(
    [{
    $group: {
        _id: null,
        MinPOP: {
            $min: "$pop"
        }
    }
}, {
    $project: {
        _id: 0
    }
}]
)

select avg(pop) from zipcode
db.zipcode.aggregate(
    [{
    $group: {
        _id: null,
        AvgPOP: {
            $avg: "$pop"
        }
    }
}, {
    $project: {
        _id: 0
    }
}]
)

select count(*) from zipcode
db.zipcode.aggregate(
    [{
    $group: {
        _id: null,
        CountPOP: {
            $sum: 1
        }
    }
}, {
    $project: {
        _id: 0
    }
}]
)

select sum(pop) from zipcode
db.zipcode.aggregate(
[{
    $group: {
        _id: null,
        SumPOP: {
            $sum: "$pop"
        }
    }
}, {
    $project: {
        _id: 0
    }
}]
)

select sum(pop) from zipcode group by city
db.zipcode.aggregate(
    [{
    $group: {
        _id: "$city",
        SumPopByCity: {
            $sum: "$pop"
        }
    }
}, {
    $project: {
        "SumPopByCity": 1,
        _id: 0,
        city: "$_id"

    }
}]
)

select sum(pop) from zipcode group by state
db.zipcode.aggregate(
    [{
    $group: {
        _id: "$state",
        SumPopByCity: {
            $sum: "$pop"
        }
    }
}, {
    $project: {
        "SumPopByCity": 1,
        _id: 0,
        Satet: "$_id"

    }
}]
)

select sum(pop) from zipcode group by state,city

[{
    $group: {
        _id: {
            field1: "$state",
            field2: "$city"
        },
        "SumOfPop": {
            $sum: "$pop"
        }
    }
}, {
    $project: {
        "State": "$_id.field1",
        "city": "$_id.field2",
        "SumOfPop": 1,
        "_id": 0
    }
}]

// select avg(pop),city from zipcode grpup by city having sum(pop) >1000 
[{
    $group: {
        _id: "$city",
        "SumOfPop": {
            $sum: "$pop"
        },
        "AvgOfPop": {
            $avg: "$pop"
        }
    }
}, {
    $match: {
        "SumOfPop": {
            $gt: 1000
        }
    }
}, {
    $project: {
        "city": "$_id",
        "Average Population": "$AvgOfPop",
        _id: 0
    }
}]

// select avg(pop),city from zipcode where loc.0 > -73 group by city having sum(pop) >1000 

[{$match: {
  "loc.0":{$gt:-73}
}}, {$group: {
  _id: "$city",
  "SumOfPop": {
    $sum: "$pop"
  },
  "AvgOfPop":{
    $avg:"$pop"
  }
}}, {$match: {
  "SumOfPop": {
    $gt: 1000
  }
}}, {$project: {
  "city": "$_id",
  "Average Population": "$AvgOfPop",
  _id: 0
}}]

// sort , limit, skip
{$sort: {
  "AvgPop": 1,
  "city":-1
}},
{$limit: 10},
{$skip: 3}]

1. Number of restaurants serving the Chinese cuisine
[{
    $match: {
        "cuisine": "Chinese"
    }
}, {
    $count: "cuisine"
}, {
    $project: {
        "cuisine": "Chinese",
        "Number Od restaurants": "$cuisine"
    }
}]

2. For each borough distinct value, find the number of restaurants 
group according to borough value and find the number of restaurants
[{$group: {
  _id: "$borough",
  "Number of restaurants": {
    $sum: 1
  }
}}, {$project: {
  "Borough":"$_id",
  "Number of restaurants":1,
  _id:0
}}]

3. For each combination of borough and cuisine , display the total number of restaurants

[{$group: {
  _id: {f1:"$borough",f2:"$cuisine"},
  SumofRestaurants: {
    $sum: 1
  }
}}, {$project: {
  "borough": "$_id.f1",
  "cuisine": "$_id.f2",
  "SumofRestaurants":1
}}]

4. For all the restaurants in zipcode "10462", display only the restaurant name, 
the cuisine they serve in caps, the borough(only first 4 letters) and one of the grades and the street name

[{$match: {
  "address.zipcode": "10462"
}}, {$project: {
  "Name": "$name",
  "Cuisine": {$toUpper: "$cuisine"},
  "Borough": {$substr: ["$borough", 0, 4]},
  "Grade": {$arrayElemAt: ["$grades", 0]},
  "Street": "$address.street",
  _id: 0
}}]


// Cursor

printjson -  to print output in json format

var c1 = db.emp.find()
c1.forEach(function(doc){printjson(doc)})

c1.forEach(function(doc){printjson(doc.empName)}) - to print only empname column

var c3 = db.emp.find()
c3.forEach(function(doc){
    var bonus = doc.salary*0.2;
    print(doc.empName+" has a salary "+doc.salary+" and has a bonus "+bonus)})

// indexes

db.emp.createIndex({empId:1})
db.emp.createUndex({salary:1},{sparse:true}) - sparse:true create index only for those fields which have the sal field

// queries on indexes

        db.emp.createIndex({empId:1})
        db.emp.createIndex({salary:1},{sparse:true})

        db.emp.find({empId:109}).explain("executionStats") -  empId_1 index
        db.emp.find({$and:[{empId:{$gt:105}},{salary:{$gt:1000}}]}).explain("executionStats") - empId_1 - winning plan, salary_1- reject plan
        db.emp.find().sort({empId:1}).explain() - empId_1
        db.emp.find().sort({empId:-1}).explain() - empId_1
        db.emp.find({empName:/^ga/i}).explain() - COLLSCAN (no index)
        db.emp.find({salary:{$exists:true}}).explain() - salary_1

        db.emp.find().sort({salary:-1}).explain() - no index?  - coz we created index with sparse index, it will not able to apply that index on null/empty sal

        db.emp.find({salary:{$type:10}}).explain() - salary_1

        db.emp.find({$and:[{empId:{$gt:105}},{salary:{$gt:1000}}]}).hint({salary:1}).explain("executionStats");empId_1 - reject plan-empty, salary_1- wining plan

// types of indexes

simple index or single index
number; string; array(multikey index), object, embedded object's field

compound index -- index on multiple field

hashed index: field will be sent to a hash algorithm. Index will be created on the basis of the hashed values

text index: index created on the basis of text

ttl index: total time to live index; create an index on a field(date field); expiry seconds  --- 3000 sec; 
once 3000 sec expire after the key field, that particular doc will be deleted


Indexes -- options:
1. sparse:true
2. partial index: query; all the doc which satisfy the query will only take part in the creation of the index
3. unique :true; all the docs with the index key should be unique

// compound index

//queries
        db.students.createIndex({studId:1,studName:-1})

        db.students.find({studId:101}) - studId_1_studName_-1
        db.students.find({studName:/^s/i}).explain("executionStats") - no index - Leading index key is not there, order of the key is important. 
        db.students.find({$and:[{studId:{$gt:103}},{studName:/^s/i}]}).explain("executionStats") - studId_1_studName_-1
        db.students.find({}).sort({studId:1}).explain("executionStats") - studId_1_studName_-1
        db.students.find({}).sort({studName:1}).explain("executionStats") - no index - Leading index key is not there, order of the key is important. studId should be there
        db.students.find({}).sort({studId:1,studName:-1}).explain("executionStats") - studId_1_studName_-1
        db.students.find({}).sort({studId:-1,studName:1}).explain("executionStats") - studId_1_studName_-1

        db.students.find({}).sort({studId:-1,studName:-1}).explain("executionStats") no index? bcz order is not matching(asc,desc order)
        db.students.find({}).sort({studId:1,studName:1}).explain("executionStats") - no index? bcz order is not matching(asc,desc order)

        db.students.find({}).sort({studName:-1,studId:-1}).explain("executionStats") - no index ; because the leading index key field is the second sort field and not the first field; 
        db.students.find({}).sort({studId:-1}).explain("executionStats")- - studId_1_studName_-1
        db.students.find({}).sort({studName:-1}).explain("executionStats")  -no index; Leading index key is not there, order of the key is important.


// hash index
db.students.getIndexes() - see all indexes
db.students.dropIndex({indexKey})
db.students.createIndex({studId:"hashed"})

// text Index

db.students.createIndex({studName:"text"})
db.students.find({$text: {$search:"s"}}).explain() -n stud name it will searcg for s



// 

db.session.insert({sessionId:"S1", dateOfCreation:new Date()})
db.session.insert({sessionId:"S2", dateOfCreation:new Date()})
db.session.insert({sessionId:"S3", dateOfCreation:new Date()})
db.session.insert({sessionId:"S4", dateOfCreation:new Date(2020, 01,06)})
db.session.insert({sessionId:"S5", dateOfCreation:new Date(2021, 01,26)})

db.session.createIndex({dateOfCreation:1},{expireAfterSeconds:3000})



// List Indexes - Lists all the indexes
 
db.getCollectionNames()
o/p: [ "books", "emp", "restaurant", "session", "students", "zipcode" ]

db.getCollectionNames().forEach(function(collection){
    var indexesArray=db[collection].getIndexes();
    print("Collection "+ collection)
    print("Indexes Are ")
    printjson(indexesArray)
    print("************************")
})

output

Collection books
Indexes Are 
[ { "v" : 2, "key" : { "_id" : 1 }, "name" : "_id_" } ]
************************
Collection emp
Indexes Are 
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_"
	},
	{
		"v" : 2,
		"key" : {
			"empId" : 1
		},
		"name" : "empId_1"
	},
	{
		"v" : 2,
		"key" : {
			"salary" : 1
		},
		"name" : "salary_1",
		"sparse" : true
	},
	{
		"v" : 2,
		"key" : {
			"_fts" : "text",
			"_ftsx" : 1
		},
		"name" : "empName_text",
		"weights" : {
			"empName" : 1
		},
		"default_language" : "english",
		"language_override" : "language",
		"textIndexVersion" : 3
	}
]
************************
Collection restaurant
Indexes Are 
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_"
	},
	{
		"v" : 2,
		"key" : {
			"address" : -1
		},
		"name" : "address_-1",
		"background" : false
	},
	{
		"v" : 2,
		"key" : {
			"address.street" : 1
		},
		"name" : "address.street_1",
		"background" : false
	},
	{
		"v" : 2,
		"unique" : true,
		"key" : {
			"restaurant_id" : 1
		},
		"name" : "restaurant_id_1",
		"background" : false
	}
]
************************
Collection session
Indexes Are 
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_"
	},
	{
		"v" : 2,
		"key" : {
			"dateOfCreation" : 1
		},
		"name" : "dateOfCreation_1",
		"expireAfterSeconds" : 3000
	}
]
************************
Collection students
Indexes Are 
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_"
	},
	{
		"v" : 2,
		"key" : {
			"studId" : 1,
			"studName" : -1
		},
		"name" : "studId_1_studName_-1"
	},
	{
		"v" : 2,
		"key" : {
			"marks" : 1
		},
		"name" : "marks_1"
	},
	{
		"v" : 2,
		"key" : {
			"_fts" : "text",
			"_ftsx" : 1
		},
		"name" : "studName_text",
		"weights" : {
			"studName" : 1
		},
		"default_language" : "english",
		"language_override" : "language",
		"textIndexVersion" : 3
	}
]
************************
Collection zipcode
Indexes Are 
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_"
	},
	{
		"v" : 2,
		"key" : {
			"pop" : 1
		},
		"name" : "pop_1",
		"background" : false,
		"partialFilterExpression" : {
			"pop" : {
				"$gt" : 1000
			}
		}
	}
]
************************
> 

Replication

Nodes:
Vote: 1 or 0
In a replica set there can be max of 50 nodes only and out of the 50 nodes only 7 can be eligible to vote.

Priority : Integer with a range of positive numbers including zero

For a node to be primary, it has to have the max priority
A node with priority zero can never become the primary

Primary
Secondary node
--> Normal secondary node; Vote : 0 or 1; Proiority : Integer > 0; Will contain the data and will always sync with the primary;

--> Arbiter node --- Does not have any data; Take part in the election process. Whenever there is a tie, arbiter will break the tie
    Arbiter can never become the primary; Vote :1; priority: 0

-->Zero priority node--- Can never become the primary ; Priority:0; Vote : 0 or 1; Will contain the data and will always sync with the primary;

--> Hidden secondary node --- Not visible to the Client app; Export data; backup or restore operation; index build operation
  Will contain the data and will always sync with the primary; Vote - 0 or 1; Priority :0;
  
--> Delayed secondary node --- will sync with the primary only after a delay; Rollback is not possible; 
    Will contain the data and will always sync with the primary but after a delay specified using the slaveDelay ;
    Vote - 0 or 1; Priority : 0; 
    
Every 2 seconds, each and every node is going to exchange a heartbaet with the other nodes
If for 10 seconds, there is no heart beat from a particular node, it means that node is down
If the secondary is down, there is no problem
If the primary is down , there will be an election process and this election has to be completed within 12 sec;
one of the eligible secondaries will become the primary ;
arbiter and nodes with vote : 1 can take part in the voting in the election process


3 member replica set:
3 nodes ;

101, data1
102, data2
103, data3

mongod --dbpath /Users/rfegade/replication/data1/ --port 101 --replSet rs1

mongod --dbpath /Users/rfegade/replication/data2/ --port 102 --replSet rs1

mongod --dbpath "/Users/rfegade/Full Stack - MEAN/Phase 3/mongodb/replication/data3/" --port 103 --replSet rs1

rs.initiate({
    _id:"rs1",
    members:[{_id:0, host:"localhost:101"},
    {_id:1, host:"localhost:102"},
    {_id:2, host:"localhost:103"}]
})

rs.status()
rs.config()

-- secondory cannot handle read/write operations but can provide permissions to read with \
rs.secondaryOk()


mongod --dbpath /Users/rfegade/replication/data2/ --port 102 --replSet rs1

Arbiter - empty node
104, data4

sudo mongod --port 104 --dbpath "/Users/rfegade/replication/data4/" --replSet rs1
rs.addArb("localhost:104") - add arbitor node; always from primary node

remove the node: rs.remove("localhost:104")


Zero PRIORITY NODE -  it will have the data
sudo mongod --port 105 --dbpath "/Users/rfegade/replication/data5/" --replSet rs1
add it from primary: rs.add({_id:4,host:"localhost:105",priority:0})


Hidden member:
106 data6, rs1
sudo mongod --port 106 --dbpath "/Users/rfegade/replication/data6/" --replSet rs1
Connect to the primary
rs.add({_id:5,host:"localhost:106",priority:0,hidden:true,votes:0})


change vote from 1 to 0
var myconfig=rs.config()
myconfig.members[5].votes=0

rs.reconfig(myconfig)

Change the configuration details
var myconfig=rs.config()
myconfig.members[1].priority=10
rs.reconfig(myconfig)


Delayed member:
107,data7,rs1
sudo mongod --port 107 --dbpath "/Users/rfegade/replication/data7/" --replSet rs1
Connect to the primary
rs.add({_id:6,host:"localhost:107",slaveDelay:300,priority:0})

rs.printSecondaryReplicationInfo() - to see the timedelay

Sharding:

horizontal scaling
store 1L docs in two difrent physical serVers
order id -- sequential
1 to 50000 server 1 -- shard 1
50001 to 1L -- server 2 -- shard 2


Adv
1. traverse thru 5000 doc to fetch the result ()
2. time for retrieval is shorter
3. availability is high

meta informtion --  config server (pss) - primary secondary seci=ondary
data  --  shard server
mongos -- router -- route the query to respective shard


Application will talk to  --> mongos -  config server - > get the meta data --> go to resective shard--> shard will return the result set to mogos --> return to the application


1. Create a config servers:
PSS 

201,202,203, csrs1, dbpath, --configsvr

mongod --port 201 --dbpath "/Users/rfegade/sharding/data1" --replSet csrs1 --configsvr

mongod --port 202 --dbpath "/Users/rfegade/sharding/data2" --replSet csrs1 --configsvr

mongod --port 203 --dbpath "/Users/rfegade/sharding/data3" --replSet csrs1 --configsvr

Connect to one of the servers from the shell 

mongo --port 201

// initiate 
rs.initiate({
_id:"csrs1",
members:[
{_id:0,host:"localhost:201"},
{_id:1,host:"localhost:202"},
{_id:2,host:"localhost:203"}]
})

rs.status()


2. Create our first shard server
301,302,303 , shard1, dbpath, --shardsvr

mongod --port 301 --dbpath "/Users/rfegade/sharding/data4" --replSet shard1 --shardsvr

mongod --port 302 --dbpath "/Users/rfegade/sharding/data5" --replSet shard1 --shardsvr

mongod --port 303 --dbpath "/Users/rfegade/sharding/data6" --replSet shard1 --shardsvr
Connect to one of the servers from the shell 
mongo --port 301
rs.initiate({
_id:"shard1",
members:[
{_id:0,host:"localhost:301"},
{_id:1,host:"localhost:302"},
{_id:2,host:"localhost:303"}]
})

rs.status()

3. Create our second shard server
401,402,403 , shard2, dbpath, --shardsvr

mongod --port 401 --dbpath "/Users/rfegade/sharding/data7" --replSet shard2 --shardsvr

mongod --port 402 --dbpath "/Users/rfegade/sharding/data8" --replSet shard2 --shardsvr

mongod --port 403 --dbpath "/Users/rfegade/sharding/data9" --replSet shard2 --shardsvr
Connect to one of the servers from the shell 

mongo --port 401

rs.initiate({
_id:"shard2",
members:[
{_id:0,host:"localhost:401"},
{_id:1,host:"localhost:402"},
{_id:2,host:"localhost:403"}]
})

rs.status()

4. configure the mongos

501
--configdb 
-- any server of config server

mongos --configdb "csrs1/localhost:201" --port 501

Connect to a mongo shell with the foll command
mongo --port 501

add various shards

sh.addShard("shard1/localhost:301")
sh.addShard("shard1/localhost:302")
sh.addShard("shard1/localhost:303")
sh.addShard("shard2/localhost:401")
sh.addShard("shard2/localhost:402")
sh.addShard("shard2/localhost:403")

o/p:
mongos> sh.addShard("shard1/localhost:301")
{
	"shardAdded" : "shard1",
	"ok" : 1,
	"operationTime" : Timestamp(1613235348, 3),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1613235348, 3),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
mongos> sh.addShard("shard1/localhost:302")
{
	"shardAdded" : "shard1",
	"ok" : 1,
	"operationTime" : Timestamp(1613235359, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1613235359, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
mongos> sh.addShard("shard1/localhost:303")
{
	"shardAdded" : "shard1",
	"ok" : 1,
	"operationTime" : Timestamp(1613235364, 2),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1613235364, 2),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
mongos> sh.addShard("shard2/localhost:401")
{
	"shardAdded" : "shard2",
	"ok" : 1,
	"operationTime" : Timestamp(1613235379, 2),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1613235379, 2),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
mongos> sh.addShard("shard2/localhost:402")
{
	"shardAdded" : "shard2",
	"ok" : 1,
	"operationTime" : Timestamp(1613235385, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1613235385, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
mongos> sh.addShard("shard2/localhost:403")
{
	"shardAdded" : "shard2",
	"ok" : 1,
	"operationTime" : Timestamp(1613235393, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1613235393, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
mongos> 

// create a database

mongos> use shardingDB
switched to db shardingDB
mongos> db.emp.insert({empId:101,empName:"Sara", salary:7647})
WriteResult({ "nInserted" : 1 })
mongos> db.emp.insert({empId:102,empName:"Lara", salary:5673})
WriteResult({ "nInserted" : 1 })
mongos> db.emp.insert({empId:103,empName:"Tara", salary:6453})
WriteResult({ "nInserted" : 1 })


sh.status --->  shows sharding status

Select shard key

1. Shard key should always be indexed
2. Shard key cannot ne changed(orderId is shard key ; Transaction Id cannot be shard kay later on)
3. shard key should be present in all the docs
4. can shard key be unique -- optional
5. shard key -- Range based sharding ;hash based sharding

Range based sharding: on basis of range of values in orderId, sharding is goingvto be done

hash based sharding:hashing algorithm; the values are going to be stored in each and every shard

sh.enableSharding("shardingDb")
sh.status()

db.zipcode.createIndex({city:1})

sh.shardCollection("shardingDB.zipcode",{city:1}) - range based
sh.shardCollection("shardingDB.zipcode",{city:"hashed"}) -- hash based

// chunk splitting
1. auto split - whenever chunk size is more than 64mb
2. manual split - specify where and how to do the splitting
    - sh.splitAt("shardingDB.zipcode",{city:"BLANDFORD"}) - 
    - sh.splitFind("shardingDB.zipcode",{city:"OAKTOWN"}) 