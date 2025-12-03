import express from "express";

import { reportAll } from "../controller/report.controller.js";
import { Authorize } from "../controller/auth.controller.js";
import { isAdmin } from "../middleware/role_validations.js";

const app = express();

app.get("/", Authorize, isAdmin, reportAll);

export default app;
