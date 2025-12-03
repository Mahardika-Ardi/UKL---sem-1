import express from "express";

import { addOrderDetail } from "../controller/order_detail.controller.js";
import { Authorize } from "../controller/auth.controller.js";
import { isKasir } from "../middleware/role_validations.js";

const app = express();

app.post("/addOrder", Authorize, isKasir, addOrderDetail);

export default app;
