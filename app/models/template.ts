import mongoose, { Model, Document } from "mongoose";

export interface ITemplate {
  name: string;
  versions: string[];
}

export interface ITemplateDocument extends Document, ITemplate {}

export const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  versions: {
    type: [String],
    required: true
  }
});

export const TemplateModel: Model<ITemplateDocument> = mongoose.model<
  ITemplateDocument
>("template", templateSchema);
