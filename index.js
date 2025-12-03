import express from "express";
import "dotenv/config";

import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import coffeRoutes from "./routes/coffe.routes.js";
import orderDetails from "./routes/order_detail.routes.js";
import orderList from "./routes/order_list.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/coffe", coffeRoutes);
app.use("/ordDetails", orderDetails);
app.use("/ordList", orderList);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
