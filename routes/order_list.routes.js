import express from "express";

import { addOrderList, update } from "../controller/order_list.controller.js";
import { Authorize } from "../controller/auth.controller";
import { isKasir } from "../middleware/role_validations";

const app = express();

app.post("/addOrdrList", Authorize, isKasir, addOrderList);
app.patch("/updateList", Authorize, isKasir, update);

export default app;
