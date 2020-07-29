const mongoose = require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userScehma=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot  conatin "password" ')
            }
        }
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if (value < 0) {
                throw new Error('age must be positive quantity')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userScehma.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userScehma.methods.toJSON=function(){
    const user=this
    const userObj=user.toObject()

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    
    return userObj;
}

userScehma.statics.findbyCredentials=async(email,password)=>{
    const user =await User.findOne({email})
    if(!user){
        throw new Error('UNABLE TO LOGIN')
    }
    const is_specific=await bcrypt.compare(password,user.password)
    if(!is_specific){
        throw new Error('UNABLE TO LOGIN')
    }
    return user;
}

userScehma.methods.generateAuthToken=async function(){
    const user=this
    const token =jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({token})
    user.save();
    return token
}


userScehma.pre('save',async function(next) {
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

    next();
})


userScehma.pre('remove',async function(next){
    const user =this;
    await Task.deleteMany({owner:user._id})

    next();
})



const User=mongoose.model('User',userScehma)


module.exports=User