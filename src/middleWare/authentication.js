import jwt from 'jsonwebtoken'
import { userModel } from '../../DB/models/user.model.js'
import { asyncHandler } from '../services/errorHandling.js'

export const roles =  {
    Admin:"Admin",
    User:"User",
    Accounting:"Accounting"
}

export const auth = (accessRoles = [roles.User])=>{
    return asyncHandler( async (req,res,next)=>{
        const {authorization} = req.headers
        if (!authorization?.startsWith(process.env.bearerKey)) {
            // res.status(200).json({message:'in-valid token or bearer key'})
            next(new Error('in-valid token or bearer key',{cause:200}))
        } else {
            const token = authorization.split(process.env.bearerKey)[1]
            const decoded = jwt.verify(token,process.env.tokenSignature)
            if (!decoded?.id||!decoded?.isLoggedIn) {
                // res.status(200).json({message:'in-valid token payload'})
                next(new Error('in-valid token payload',{cause:200}))

            } else {
                const user =await userModel.findById(decoded.id)
                if (!user) {
                    // res.status(404).json({message:'can not find user'})
                    next(new Error('Not register user',{cause:401}))

                } else {
                    if (!accessRoles.includes(user.role)) {
                    next(new Error('Un-authorized user',{cause:403})) 
                    } else {
                        req.user=user
                        next()  
                    }

                }
            }
        }
    }
)}

