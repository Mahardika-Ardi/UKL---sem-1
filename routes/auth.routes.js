import express from "express";

import { login } from "../controller/auth.controller.js";

const app = express();

app.post("/login", login);

export default app;
