import mongoose, { Model, Document } from "mongoose";

export interface IDeployment {
  url: string;
  templateName: string;
  version: string;
  deployedAt: Date;
}

export interface IDeploymentDocument extends Document, IDeployment {}

export const deploymentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  templateName: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  deployedAt: {
    type: Date,
    required: true
  }
});

export const DeploymentModel: Model<IDeploymentDocument> = mongoose.model<
  IDeploymentDocument
>("deployment", deploymentSchema);
