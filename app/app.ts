import express from "express";
import cors from "cors";
import deployments from "./routes/deployments";
import templates from "./routes/templates";

import { mongoUri, mongoConfig } from "./config/mongo";
import mongoose from "mongoose";

const app = express();

const APP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Healthy");
});

app.get("/stat", (req, res) => {
  res.send("Healthy");
});

app.use("/deployments", deployments);
app.use("/templates", templates);

mongoose.connect(mongoUri, mongoConfig, () => {
  app.listen(APP_PORT, () => {
    console.log(`Server is listening on port: ${APP_PORT}`);
  });
});

export default app;
