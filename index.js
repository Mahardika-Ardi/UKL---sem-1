import express from "express";
import "dotenv/config";

import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import coffeRoutes from "./routes/coffe.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/coffe", coffeRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
