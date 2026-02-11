import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserTypeModel } from "../models/UserModel.js";

//register function
export const register = async (userObj)=>{
    //create document
    const userDoc = new UserTypeModel(userObj)
    // validate empty passwords
    await userDoc.validate();
    //hash and replace the  plain password
    userDoc.password = await bcrypt.hash(userDoc.password,10);
    //save
    const created = await userDoc.save()
    //convert document into object to remove password
    const newUserObj=created.toObject();
    //remove password
    delete newUserObj.password;
    //return user onj without password
    return newUserObj
}

//authenticate function
export const authenticate = async({email,password})=>{
    //check the user with email and role
    const user = await UserTypeModel.findOne({email});
    if(!user){
        const err =new Error("Invalid email or role");
        err.status=401;
        throw err;
    }
    //compare passwords
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        const err =new Error("invalid password");
        err.status =401;
        throw err;
    }
    //check nisActive state
    if(user.isActive===false){
        const err = new Error("your account blocked.Plz contact Admin")
        err.status=403;
        throw err;
    }
    const token = jwt.sign({userId: user._id,
    role:user.role,email:user.email},
    process.env.JWT_SECRET,{
        expiresIn:"1h",
    });
    const userObj=user.toObject();
    delete userObj.password;

    return {token,user:userObj};
}