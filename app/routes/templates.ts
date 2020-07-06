import express from "express";
import * as TemplatesController from "../controllers/TemplatesController";

const deploymentsRoute = express.Router();

deploymentsRoute.get("/", TemplatesController.getTemplates);

export default deploymentsRoute;
