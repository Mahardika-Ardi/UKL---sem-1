import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  addCoffe,
  updateCoffe,
  deltMenu,
  findCoffe,
} from "../controller/coffe.controller.js";
import { Authorize } from "../controller/auth.controller.js";
import { isAdmin } from "../middleware/role_validations.js";

const currentfile = fileURLToPath(import.meta.url);
const currentdir = path.dirname(currentfile);
const uploadDir = path.join(currentdir, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post("/addMenu", Authorize, isAdmin, upload.single("image"), addCoffe);
app.patch(
  "/updateMenu/:id",
  Authorize,
  isAdmin,
  upload.single("image"),
  updateCoffe
);
app.delete("/deleteMenu", Authorize, isAdmin, deltMenu);
app.delete("/findCoffe/:id", Authorize, isAdmin, findCoffe);
app.delete("/findCoffe", Authorize, isAdmin, findCoffe);

export default app;
