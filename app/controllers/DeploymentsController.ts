import { RequestHandler } from "express";
import validator from "validator";
import {
  DeploymentModel,
  IDeployment,
  IDeploymentDocument
} from "../models/deployment";
import { promisify } from "util";
import { validate } from "../utils/validate";

export const getDeployments: RequestHandler = async (req, res) => {
  const find = promisify<IDeploymentDocument[]>(
    DeploymentModel.find.bind(DeploymentModel)
  );

  try {
    const docs = await find();
    res.json({ items: docs });
  } catch (e) {
    res.status(500).json({ status: "FAILED", message: e.message });
  }
};

export const addDeployment: RequestHandler<
  Record<string, string>,
  ResponseBodySingle<IDeployment>,
  Partial<Omit<IDeployment, "deployedAt">>
> = async (req, res) => {
  try {
    validate(
      validator.isSemVer,
      "version has to be in SemVer format"
    )(req.body.version);

    validate(validator.isURL, "url property has to be valid url")(req.body.url);

    validate(
      validator.isAlpha,
      "templateName must contain only alpha characters"
    )(req.body.templateName);
  } catch (e) {
    res.status(400).json({ status: "FAILED", message: e.message });
    return;
  }

  const deployment = new DeploymentModel({
    url: req.body.url,
    templateName: req.body.templateName,
    version: req.body.version,
    deployedAt: new Date()
  });

  try {
    const insertedElement = await deployment.save();
    res.json({ status: "OK", item: insertedElement });
  } catch (e) {
    res.status(500).json({ status: "FAILED", message: e.message });
  }
};

export const deleteDeployment: RequestHandler = async (req, res) => {
  const deleteOne = promisify(DeploymentModel.deleteOne.bind(DeploymentModel));

  try {
    const operationSummary = await deleteOne({ _id: req.params.id });
    res.json(operationSummary);
  } catch (e) {
    res.status(500).json({ status: "FAILED", message: e.message });
  }
};
