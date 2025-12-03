import express from "express";

import {
  addOrderDetail,
  updateOrderDetail,
  find,
} from "../controller/order_detail.controller.js";
import { Authorize } from "../controller/auth.controller.js";
import { isKasir } from "../middleware/role_validations.js";

const app = express();

app.post("/addOrder", Authorize, isKasir, addOrderDetail);
app.patch("/updateOrder/:id", Authorize, isKasir, updateOrderDetail);
app.patch("/updateOrder", Authorize, isKasir, updateOrderDetail);
app.get("/getOrder/:id", Authorize, isKasir, find);
app.get("/addOrder", Authorize, isKasir, find);

export default app;
