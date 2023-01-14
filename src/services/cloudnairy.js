import cloudinary from "cloudinary";
import { fileURLToPath } from "url";
import path from "path"
import dotenv from 'dotenv'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path:path.join(__dirname,'../../config/.env')})

//development
cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret:process.env.APISECRET,
  secure: true,
});

export default cloudinary.v2;
