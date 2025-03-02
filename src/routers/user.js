const express =require('express')
const { model } = require('../models/user')
const router= new express.Router()
const User=require('../models/user')
const auth =require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancellation}=require('../emails/account')

router.post('/users', async (req,res)=>{
    const user =new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token =await user.generateAuthToken();
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }

    // user.save().then(()=>{
    //     res.status(201).send(user)
            
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

// router.get('/users/:id',auth,async (req,res)=>{
//     const _id=req.params.id
    
//     try {
//         const user=await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)

//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
// })

router.patch('/users/me',auth,async(req,res)=>{
    const allowed_updates=["name","age","email","password"]
    const updates=Object.keys(req.body)
    const is_valid=updates.every((update)=>allowed_updates.includes(update))

    if (!is_valid) {
        return res.status(400).send()
    }
    try {
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        // const user =await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
      
        res.send(req.user)
    } catch (error) {
        res.status(400).send()
        
    }
})

router.delete('/users/me',auth ,async(req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancellation(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/login',async(req,res)=>{
    try {
        const user= await User.findbyCredentials(req.body.email,req.body.password);
        const token =await user.generateAuthToken()
        res.send({ user,token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall',auth,async(req,res)=>{
    try {
        req.user.tokens=[];
        req.user.save(),
        res.send()
    } catch (error) {
        res.status(500).send()

    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('upload image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send();
})

router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)

        if ( !user|| !user.avatar) {
            throw new Error()
        }

        res.set('Content-type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports=router