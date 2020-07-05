import { RequestHandler } from "express";
import validator from "validator";
import {
  DeploymentModel,
  IDeployment,
  IDeploymentDocument
} from "../models/deployment";
import { validate } from "../utils/validate";

export const getDeployments: RequestHandler<
  Record<string, string>,
  ResponseBodyList<IDeploymentDocument>,
  null,
  ListBasicQuery
> = async (req, res) => {
  const limit =
    Number.isNaN(req.query.limit) || !req.query.limit
      ? 10
      : Number(req.query.limit);
  const skip =
    Number.isNaN(req.query.offset) || !req.query.offset
      ? 0
      : Number(req.query.offset);

  const query = DeploymentModel.find({}, null, { limit, skip });

  try {
    const total = await DeploymentModel.countDocuments().exec();
    const docs = await query.exec();
    res.json({
      status: "OK",
      items: docs,
      totalCount: total,
      limit,
      offset: skip
    });
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
  const query = DeploymentModel.deleteOne({ _id: req.params.id });

  try {
    const operationSummary = await query.exec();
    res.json(operationSummary);
  } catch (e) {
    res.status(500).json({ status: "FAILED", message: e.message });
  }
};
