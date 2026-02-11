import exp from'express';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { UserTypeModel } from '../models/UserModel.js';
export const adminRoute =exp.Router()


//read all articles

//block
adminRoute.delete("/users/:userid",verifyToken,async(req,res)=>{
    let user = req.params.userid;
    let userOfDB=await UserTypeModel.findById(user)
    if(!userOfDB){
        res.status(401).json({message:"user not found"})
    }
    await UserTypeModel.findByIdAndUpdate(user,{$set:{isActive:false}})
    await userOfDB.save()
    res.status(200).json({message:"user blocked",payload:userOfDB})

})





//unblock user roles 
adminRoute.get("/users/:userid",verifyToken,async(req,res)=>{
    let user = req.params.userid;
    let userOfDB=await UserTypeModel.findById(user)
    if(!userOfDB){
        res.status(401).json({message:"user not found"})
    }
    await UserTypeModel.findByIdAndUpdate(user,{$set:{isActive:true}})
    res.status(200).json({message:"user unblocked"})

})