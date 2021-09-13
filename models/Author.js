const {model,Schema} = require('mongoose')


const author_schema = new Schema({
    name:{
        type:"String",
        default:"Sumit"
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
    }
})


const Author = model('author',author_schema)

module.exports = Author;