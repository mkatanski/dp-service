import express from "express";
import deployments from "./routes/deployments";
import { connectMongo } from "./config/mongo";

const app = express();

const APP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Healthy");
});

app.get("/stat", (req, res) => {
  res.send("Healthy");
});

app.use("/deployments", deployments);

connectMongo().then(() => {
  app.listen(APP_PORT, () => {
    console.log(`Server is listening on port: ${APP_PORT}`);
  });
});

export default app;
