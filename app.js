import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "./config/.env") });
import express from "express";
import {appRouter} from './src/modules/index.js'

const app = express();
const port = process.env.PORT || 5000;
appRouter(app)

app.listen(port, () => {
  console.log(`running ya 7or on.......${port}`);
});
