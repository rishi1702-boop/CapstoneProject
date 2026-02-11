import exp from 'express';
import { authenticate } from '../services/authServices.js';
export const commonRoute = exp.Router();

//login
commonRoute.post("/login",async(req,res)=>{
    let userCred =req.body;
    let {token,user}=await authenticate(userCred)
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false,
    })
    res.status(201).json({message:"login success",payload:user})
})

//logout
commonRoute.get("/logout",async(req,res)=>{
    //clear the cookie named 'token
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    });
    res.status(200).json({message:'logged out successfull'})
})


//change password
commonRoute.put("/change-password",async(req,res)=>{
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // requires auth middleware to set req.user
    // Find user
    const user = await User.findById(userId);
    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password directly (bcrypt handles salt internally)
    user.password = await bcrypt.hash(newPassword, 10); // 10 = salt rounds
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });

})