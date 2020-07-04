import express from "express";

const app = express();

const APP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Healthy");
});

app.get("/stat", (req, res) => {
  res.send("Healthy");
});

app.listen(APP_PORT, () => {
  console.log(`Server is listening on port: ${APP_PORT}`);
});

export default app;
