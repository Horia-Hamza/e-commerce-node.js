import { userModel } from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { find, findById,findByIdAndUpdate } from "../../../../DB/DBMethods.js";
export const profile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.status(400).json({ message: "done", user });
});
export const userById = asyncHandler(async (req, res, next) => {
    const {id} = req.params
  const user = await findById({
    model: userModel,
    conditions: {_id:id},
    select:'userName email'
  });
  if (!user) {
    next(new Error('can not find user',{cause:404}))
  } else {
  res.status(400).json({ message: "done", user });
    
  }
});
export const softDelete = asyncHandler(async(req,res,next)=>{
  const user = await findById({
    model: userModel,
    conditions: req.user._id,
    select: "isDeleted blocked",
  });
  if (user) {
    if (user.blocked) {
      next(new Error("Your account is blocked", { cause: 400 }));
    } else {
      if (user.deleted) {
       const account = await findByIdAndUpdate({
          model: userModel,
          condition: user._id,
          data: { isDeleted: false },
          option: { new: true },
          select: "password",
        });
      } else {
        account = await findByIdAndUpdate({
          model: userModel,
          condition: user._id,
          data: { isDeleted: true, active: false },
          option: { new: true },
          select: "password",
        });
      }
      res.status(200).json({ message: "Done", account });
    }
  } else {
    next(new Error("In-valid user", { cause: 404 }));
  }
});
