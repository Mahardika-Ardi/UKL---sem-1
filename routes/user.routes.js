import express from "express";

import {
  addUser,
  updateUsers,
  deltUsers,
  find,
} from "../controller/users.controller.js";
import { Authorize } from "../controller/auth.controller.js";
import { isAdmin } from "../middleware/role_validations.js";

const app = express();

app.post("/addUsers", addUser);
app.patch("/updateUsers", updateUsers);
app.delete("/deleteUsers", deltUsers);
app.get("/find/:id", Authorize, isAdmin, find);
app.get("/find", Authorize, isAdmin, find);

export default app;
