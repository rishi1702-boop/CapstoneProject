import exp from'express';
import { register } from '../services/authServices.js';
import { UserTypeModel } from '../models/UserModel.js';
import { articleTypeModel } from '../models/ArticleModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import {  verifyToken   } from '../middlewares/verifyToken.js'
export const authorRoute =exp.Router()

//register author
authorRoute.post('/users',async(req,res)=>{
    //get userObj from req
    let userObj = req.body;
    //call register
    const newUserObj=await register({...userObj,role:"AUTHOR"})
    //send res
    res.status(201).json({message:"author created",payload:newUserObj})
})
//create artcle
authorRoute.post('/articles',async(req,res)=>{
    //get article from req
    let articleObj =req.body;
    //check for author
    let author =await UserTypeModel.findById(articleObj.author)
    if(!author || author.role===!"AUTHOR") {
        return res.status(401).json({message:"invalid author"})
    }
    //create article doc
    let articleDoc = new articleTypeModel(articleObj)
    //save
    let createdArticle =await articleDoc.save();
    //send res
    res.status(201).json({message:"article created",payload:createdArticle})
})

//read articles of author
authorRoute.get("/articles/:authorId",verifyToken, checkAuthor, async (req, res) => {
    const aid = req.params.authorId;
      // fetch all articles
    const articlesDoc = await articleTypeModel.find({ author: aid ,isArticleActive:true}).populate("author","firstName email");


      // send one combined response
    res.status(200).json({
        message: "Fetched articles",
        allArticles: articlesDoc,
    });
})

//edits artcles
authorRoute.put("/articles/:articleid",verifyToken,checkAuthor,async(req,res)=>{
    //get modified articles from req
    let objId=req.params.articleid;
    let modifiedArticle=req.body
    let articleOfDB =await articleTypeModel.find({_id:objId,author:modifiedArticle.author})
    if(!articleOfDB){
        res.status(200).json({message:"artcle not found"})
    }
    //update article
    await articleTypeModel.findByIdAndUpdate(objId,{$set:{...modifiedArticle}},{new:true})
    //send res
    res.status(200).json({message:"modified article",payload:modifiedArticle})
})

//(soft delete) article
authorRoute.delete("/articles/author-id/:aid/article-id/:arid",verifyToken,checkAuthor,async(req,res)=>{
    const { aid, arid } = req.params;

    // find article by id and author
    const articleOfDB = await articleTypeModel.findOne({ _id: arid, author: aid });

    if (!articleOfDB) {
    return res.status(404).json({ message: "Article not found for this author" });
    }

    // soft delete: mark as inactive
    const modifiedArticle = await articleTypeModel.findByIdAndUpdate(
    arid,
    { $set: { isActive: false } },
      { new: true } // return updated doc
    );

    res.status(200).json({
    message: "Article soft deleted",
    payload: modifiedArticle,})
})

//read article of author