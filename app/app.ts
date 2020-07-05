import express from "express";
import deployments from "./routes/deployments";

import { mongoUri, mongoConfig } from "./config/mongo";
import mongoose from "mongoose";

const app = express();

const APP_PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Healthy");
});

app.get("/stat", (req, res) => {
  res.send("Healthy");
});

app.use("/deployments", deployments);

mongoose.connect(mongoUri, mongoConfig, () => {
  app.listen(APP_PORT, () => {
    console.log(`Server is listening on port: ${APP_PORT}`);
  });
});

export default app;
