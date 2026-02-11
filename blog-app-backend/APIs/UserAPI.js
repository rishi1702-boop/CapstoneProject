import exp from'express';
import { authenticate, register } from '../services/authServices.js';
import { articleTypeModel } from '../models/ArticleModel.js';
export const userRoute =exp.Router()
//register user
userRoute.post('/users',async(req,res)=>{
    //get userObj from req
    let userObj = req.body;
    //call register
    const newUserObj=await register({...userObj,role:"USER"})
    //send res
    res.status(201).json({message:"user created",payload:newUserObj})
})

//real all articles
userRoute.get('/articles',async(req,res)=>{
    let articles = await articleTypeModel.find()
    res.status(200).json({message:"fetched all articles",payload:articles})
})
//add coments to articles
userRoute.get("/articles/:articleid",async(req,res)=>{
    //

})