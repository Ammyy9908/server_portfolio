const {model,Schema} = require('mongoose')


const author_schema = new Schema({
    name:{
        type:"String",
        default:"Sumit"
    },
    image:{
        type:"String",
        default:"https://sumitkumar.vercel.app/static/media/avatar.6d663021.jpeg"
    },
    works:{
        type:"Array",
        default:[]
    },
    education:{
        type:"Array",
        default:[]
    },
    work_experience:{
        type:"Array",
        default:[]
    },
    skills:{
        type:"Array",
        default:[]
    },
    color:{
        type:"String",
        default:"#F3BE36"
    },
    role:{
        type:"String",
        default:"Full Stack Developer"
    },
    subheading:{
        type:"String",
        default:"I’m Full Stack Web Developer in Mern Stack Love to Develope MERN Satck Web Applications"
    }
})


const Author = model('author',author_schema)

module.exports = Author;