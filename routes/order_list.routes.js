import express from "express";

import {
  addOrderList,
  update,
  findOrderList,
} from "../controller/order_list.controller.js";
import { Authorize } from "../controller/auth.controller.js";
import { isKasir } from "../middleware/role_validations.js";

const app = express();

app.post("/addOrdrList", Authorize, isKasir, addOrderList);
app.patch("/updateList", Authorize, isKasir, update);
app.get("/findUpdtList/:id", Authorize, isKasir, findOrderList);
app.get("/findUpdtList", Authorize, isKasir, findOrderList);

export default app;
