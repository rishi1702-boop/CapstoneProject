import exp from  'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import { userRoute } from './APIs/UserAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import cookieParser from 'cookie-parser';
import { commonRoute } from './APIs/CommonAPI.js';
config()//process.env
const app =exp()

//add body parser middleware

//connect pi
app.use(exp.json())
app.use(cookieParser())
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use('/common-api',commonRoute)



//connect  to db
const connectDB = async()=>{
    try{
    await connect(process.env.DB_URL)
    console.log("DB connection success")
    app.listen(process.env.PORT,()=>console.log("server started"))
    }
    catch(err){
        console.log("err in Db connection",err)
    }
}
connectDB()

//dealing with invalid path
app.use(( req, res, next)=>{
    console.log(req.url)
    res.json({message:`${req.url} is invalid`})

})

//error handling middlewares
app.use((err,req,res,next)=>{
    console.log("err :",err)
    res.json({message:"error",reason:err.message})
})



