const mongoose=require('mongoose');
// schema creation
const Loginschema=new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})

const signupschema=new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})
const loginModel =new mongoose.model("loginCollection",Loginschema)
const registerModel=new mongoose.model("registerCollection",signupschema)
module.exports={
    signin:loginModel,
    signup:registerModel
}