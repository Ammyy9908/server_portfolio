const express = require('express')
const cors = require('cors')
const socketIo = require("socket.io");
const http = require("http");
const app = express()
const mongoose = require('mongoose')
const Author = require('./models/Author')
const nodemailer = require('nodemailer')
const { check, validationResult }
    = require('express-validator');
app.use(cors())
app.use(express.json())
app.use(express.static('public'));


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
app.post("/data",async (req,res)=>{
    const {name,color,image,role,subheading} = req.body;
    var io = req.app.get('socketio');
  

    new Author({
        name,color,image,role,subheading
    }).save().then(()=>{
        io.emit("data",{name,color})
        return res.status(200).send({message:"Data added!"})
    })
    
})

app.put(`/data/:id`,async (req,res)=>{
    const {name,color,image,role,subheading} = req.body;
    const {id} = req.params;
    var io = req.app.get('socketio');
    

    Author.updateOne({_id:id},{name:name,color:color,image:image,role:role,subheading:subheading}).then(()=>{
        io.emit("data",{name,color,image,role,subheading})
        return res.status(200).send({message:"Data added!"})
    }).catch((e)=>{
        console.log(e)
    })
})
.post('/contact',check('email','Invalid Email').isEmail(),async (req,res)=>{
    const {email,message,name} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(200).send({error:errors.errors[0].msg});
    }

    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:'reactgraminfo@gmail.com',
            pass: '2146255$b8'
        }
    });

    const mailOptions = {
        from: 'reactgraminfo@gmail.com', // sender address
        to: 'sb78639@gmail.com', // list of receivers
        subject: `Portfolio Message`, // Subject line
        html: `<div style="width:90%;padding:15px;box-shadow:10px 10px 10px 0 rgba(0,0,0,.115)">
        <h1>Portfolio Message</h1>
        <h3>${name}</h3>
        <p>${message}</p>
        <p>-by email: ${email}
        </div>`
        
        // plain text body
      };

      transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            return res.status(500).send({error:"Error in Sending Message,Try Again!"})
        }
        res.status(200).send({message:"Thanks for Contacting! I will respond you shortly."})

     })
   
    
})

app.get('/resume',async (req,res)=>{
    const file = `${__dirname}/public/resume.pdf`;
    res.sendFile(file)
})

app.post('/work/:id',async (req,res)=>{

    const author = await Author.findOne({_id:req.params.id});
    var io = req.app.get('socketio');
    const work = [...author.works,req.body.work];

    Author.updateOne({_id:req.params.id},{works:work}).then(()=>{
        io.emit("work",req.body.work)
        return res.status(200).send({message:"Work added!"})
    })
})

app.get('/works',async (req,res)=>{
    const author = await Author.find()
    res.status(200).send({works:author[0].works})
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
