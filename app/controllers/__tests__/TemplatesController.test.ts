import * as TemplatesController from "../TemplatesController";
import { Request, Response } from "express";

import { TemplateModel } from "../../models/template";

jest.mock("../../models/template", () => ({
  TemplateModel: jest.fn()
}));

interface ModelMock extends jest.Mock {
  find: jest.Mock;
  countDocuments: jest.Mock;
  deleteOne: jest.Mock;
}

const TemplateModelMock = (TemplateModel as unknown) as ModelMock;

describe("TemplatesController", () => {
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const makeResponseObj = (): Response =>
    (({ status: statusMock, json: jsonMock } as unknown) as Response);

  const makeRequestObj = ({
    body,
    params,
    query
  }: {
    body?: Record<string, string>;
    params?: Record<string, string>;
    query?: Record<string, string>;
  }): Request =>
    (({
      body,
      params,
      query
    } as unknown) as Request);

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    TemplateModelMock.find = jest.fn();
    TemplateModelMock.countDocuments = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(13) });
  });

  describe("getTemplates", () => {
    it("should return correct value", async () => {
      TemplateModelMock.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ test: "test" })
        })
      });

      await TemplatesController.getTemplates(
        makeRequestObj({ query: { limit: "100", offset: "20" } }),
        makeResponseObj(),
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({
        items: {
          test: "test"
        },
        limit: 100,
        offset: 20,
        status: "OK",
        totalCount: 13
      });
    });

    it("should return failure message", async () => {
      TemplateModelMock.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue({ message: "something went wrong" })
        })
      });

      await TemplatesController.getTemplates(
        makeRequestObj({ query: { limit: "100", offset: "0" } }),
        makeResponseObj(),
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "something went wrong",
        status: "FAILED"
      });
    });
  });
});
