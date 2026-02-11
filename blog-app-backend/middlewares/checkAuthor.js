import { UserTypeModel } from "../models/UserModel.js";

export const checkAuthor = async (req, res, next) => {
    // get author id
    const aid = req.body?.author || req.params?.authorId;

    // verify author
    const author = await UserTypeModel.findById(aid);

    if (!author ) {
    return res.status(401).json({ message: "invalid author" });
    }
    if ( author.role !== "AUTHOR") {
        return res.status(403).json({ message: "User is not an author" });
    }
    if (!author.isActive ) {
        return res.status(403).json({ message: "author account is not active" });
        }
    // forward request to next
    next();
}