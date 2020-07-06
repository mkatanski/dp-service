import { RequestHandler } from "express";
import { TemplateModel, ITemplateDocument } from "../models/template";

export const getTemplates: RequestHandler<
  Record<string, string>,
  ResponseBodyList<ITemplateDocument>,
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

  const query = TemplateModel.find({}, null, { limit, skip });

  try {
    const total = await TemplateModel.countDocuments().exec();
    const docs = await query.sort("-deployedAt").exec();
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
