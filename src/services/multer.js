import multer from "multer";
export const multerValidation = {
  image: ["image/png", "image/jpeg", "image/gif"],
  pdf: ["application/pdf"],
};
export const HME = (err,req,res,next)=>{
  if (err) {
    res.json({message:"multer err",err})
  } else {
    res.json({message:"done"})
    next()
    
  }
}
export function myMulter(customValidation = multerValidation.image) {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("invalid format", false);
    }
  }
  const upload = multer({ storage: storage });
  return upload;
}
