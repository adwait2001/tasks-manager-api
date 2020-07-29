const express = require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')
const userRouter=require('./routers/user')
const userRouter2=require('./routers/task')


const app=express()
const port =process.env.PORT

// app.use((req,res,next)=>{
//     if (req.method==='GET') {
//         res.send('GET request are disabled')
//     }else{
//         next();
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('site is under maintenance fuck off')
// })

app.use(express.json())
app.use(userRouter)
app.use(userRouter2)

const bcrypt=require('bcryptjs')

// const myfunction=async()=>{
//     const pass="123445ds"
//     const hashpass=await bcrypt.hash(pass,8)

//     console.log(pass)
//     console.log(hashpass)

//     const is_true=await bcrypt.compare('123445ds',hashpass)
//     console.log(is_true)
// }

// myfunction()

const jwt=require('jsonwebtoken')

// const myfunction=async()=>{
//     const token=jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
//     console.log(token)

//     console.log(jwt.verify(token,'thisismynewcourse'))
// }
// myfunction()

const pet={
    name:"pet"
}

pet.toJSON=function() {
    return {name:'harman'};
}

console.log(JSON.stringify(pet))

app.listen(port,()=>{
    console.log("server is running at " + port)
})


// const multer =require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('upload word'))
//         }

//         cb(undefined,true)
//     }
// })

// const middleware=(req,res,next)=>{
//     throw new Error('from my middleware')
// }

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })


// const main =async()=>{
//     // const task= await Task.findById('5f1e9aae19ab1b35ecdf5e62')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user=await User.findById('5f1e92bb972983256484bdaf')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()