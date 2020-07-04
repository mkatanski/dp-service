import express from "express";
import * as DeploymentsController from "controllers/DeploymentsController";

const deploymentsRoute = express.Router();

deploymentsRoute.get("/", DeploymentsController.getDeployments);
deploymentsRoute.post("/:id", DeploymentsController.addDeployment);
deploymentsRoute.delete("/:id", DeploymentsController.deleteDeployment);

export default deploymentsRoute;
