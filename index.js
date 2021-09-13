const express = require('express')
const cors = require('cors')
const socketIo = require("socket.io");
const http = require("http");
const app = express()
const mongoose = require('mongoose')
const Author = require('./models/Author')

app.use(cors())
app.use(express.json())


mongoose.connect(`mongodb+srv://sumit:2146255sb8@cluster0.ur0yc.mongodb.net/portfolio`).then(()=>{
    console.log('Database connected!')
}).catch((e)=>{
    console.log("Error in connecting db",e);
})
const port = process.env.PORT || 5000;



const server = http.createServer(app);
const io = socketIo(server);
app.set('socketio', io);

app.get("/data",async (req,res)=>{
    const data = await Author.find()
    return res.status(200).send({data:data[0]})
})
app.post("/data/:id",async (req,res)=>{
    const {name,color,id} = req.body;
    var io = req.app.get('socketio');
  

    new Author({
        name,color
    }).save().then(()=>{
        io.emit("data",{name,color})
        return res.status(200).send({message:"Data added!"})
    })
    
})

app.put(`/data/:id`,async (req,res)=>{
    const {name,color} = req.body;
    const {id} = req.params;
    var io = req.app.get('socketio');
    

    Author.updateOne({_id:id},{name:name,color:color}).then(()=>{
        io.emit("data",{name,color})
        return res.status(200).send({message:"Data added!"})
    }).catch((e)=>{
        console.log(e)
    })
})

io.on("connection",(socket) =>{

    console.log("Client connected!")

    socket.emit("color",{color:"red"})
   
    socket.on("disconnect",()=>{
        console.log("Client disconnected")
       
    })
})

server.listen(port,()=>{
    console.log(`Listening on ${port}`);
})
