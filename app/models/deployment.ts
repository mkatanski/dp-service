import mongoose, { Model, Document } from "mongoose";

export interface IDeployment {
  url: string;
  templateName: string;
  version: string;
  deployedAt: string;
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
    type: String,
    required: true
  }
});

export const deploymentModel: Model<IDeploymentDocument> = mongoose.model<
  IDeploymentDocument
>("deployment", deploymentSchema);
