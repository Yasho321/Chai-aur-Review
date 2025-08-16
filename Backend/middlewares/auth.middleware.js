import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const requireAuth =async (req, res, next) => {
  try {
        let token ;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1]
        } else if (req.cookies?.token) {
        // Fallback to cookie for same-origin requests
            token = req.cookies.token
        }


        if(!token){
            return res.status(400).json({
                success : false , 
                
                message : "No Token Found"
            })
        }

        const decoded =  jwt.verify(token , process.env.JWTSECRET_KEY) ;

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            res.status(400).json({
                success : false ,
                message : "User Not Found via token"
            })
        }

        req.user = user ; 

        next();
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success : false ,
            message : "Error while authentic token",
        })
    }
};

export const requireAdmin = (req, res, next) => {
   
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};
