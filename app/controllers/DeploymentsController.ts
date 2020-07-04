import { RequestHandler } from "express";

export const getDeployments: RequestHandler = (req, res) => {
  res.json({ status: "OK" });
};

export const addDeployment: RequestHandler = (req, res) => {
  res.json({ status: "OK", param: req.params["id"] });
};

export const deleteDeployment: RequestHandler = (req, res) => {
  res.json({ status: "OK", param: req.params["id"] });
};
