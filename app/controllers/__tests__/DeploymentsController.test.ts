import * as DeploymentsController from "../DeploymentsController";
import { Request, Response } from "express";

import { DeploymentModel } from "../../models/deployment";

jest.mock("../../models/deployment", () => ({
  DeploymentModel: jest.fn()
}));

interface ModelMock extends jest.Mock {
  find: jest.Mock;
  countDocuments: jest.Mock;
  deleteOne: jest.Mock;
}

const DeploymentModelMock = (DeploymentModel as unknown) as ModelMock;

describe("DeploymentsController", () => {
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

    DeploymentModelMock.find = jest.fn();
    DeploymentModelMock.countDocuments = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(13) });
  });

  describe("getDeployments", () => {
    it("should return correct value", async () => {
      DeploymentModelMock.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ test: "test" })
        })
      });

      await DeploymentsController.getDeployments(
        makeRequestObj({ query: { limit: "100", offset: "0" } }),
        makeResponseObj(),
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({
        items: {
          test: "test"
        },
        limit: 100,
        offset: 0,
        status: "OK",
        totalCount: 13
      });
    });

    it("should return failure message", async () => {
      DeploymentModelMock.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue({ message: "something went wrong" })
        })
      });

      await DeploymentsController.getDeployments(
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

  describe("addDeployment", () => {
    it("should return correct value", async () => {
      DeploymentModelMock.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          insertedElementData: true
        })
      }));

      await DeploymentsController.addDeployment(
        makeRequestObj({
          body: {
            url: "http://mkatanski.com",
            templateName: "SuperDuper",
            version: "1.0.0",
            deployedAt: "2016-07-08T12:30:00Z"
          }
        }),
        makeResponseObj(),
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledWith({
        item: { insertedElementData: true },
        status: "OK"
      });
    });

    it("should return error", async () => {
      DeploymentModelMock.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue({ message: "something went wrong" })
      }));

      await DeploymentsController.addDeployment(
        makeRequestObj({
          body: {
            url: "http://mkatanski.com",
            templateName: "SuperDuper",
            version: "1.0.0",
            deployedAt: "2016-07-08T12:30:00Z"
          }
        }),
        makeResponseObj(),
        jest.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "something went wrong",
        status: "FAILED"
      });
    });

    it("should return invalid url message", async () => {
      DeploymentModelMock.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          insertedElementData: true
        })
      }));

      await DeploymentsController.addDeployment(
        makeRequestObj({
          body: {
            url: "mkatanski.",
            templateName: "SuperDuper",
            version: "1.0.0",
            deployedAt: "2016-07-08T12:30:00Z"
          }
        }),
        makeResponseObj(),
        jest.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "url property has to be valid url",
        status: "FAILED"
      });
    });

    it("should return invalid version message", async () => {
      DeploymentModelMock.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          insertedElementData: true
        })
      }));

      await DeploymentsController.addDeployment(
        makeRequestObj({
          body: {
            url: "mkatanski.com",
            templateName: "SuperDuper",
            version: "1.0.0.",
            deployedAt: "2016-07-08T12:30:00Z"
          }
        }),
        makeResponseObj(),
        jest.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "version has to be in SemVer format",
        status: "FAILED"
      });
    });

    it("should return invalid templateName message", async () => {
      DeploymentModelMock.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          insertedElementData: true
        })
      }));

      await DeploymentsController.addDeployment(
        makeRequestObj({
          body: {
            url: "mkatanski.com",
            templateName: "SuperDuper1",
            version: "1.0.0",
            deployedAt: "2016-07-08T12:30:56Z"
          }
        }),
        makeResponseObj(),
        jest.fn()
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "templateName must contain only alpha characters",
        status: "FAILED"
      });
    });
  });

  describe("deleteDeployment", () => {
    it("should return correct value", async () => {
      DeploymentModelMock.deleteOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: "test_id" })
      });

      await DeploymentsController.deleteDeployment(
        makeRequestObj({
          params: { id: "test_id" }
        }),
        makeResponseObj(),
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({ _id: "test_id" });
    });

    it("should return failure", async () => {
      DeploymentModelMock.deleteOne = jest.fn(() => ({
        exec: jest.fn().mockRejectedValue({ message: "something went wrong" })
      }));

      await DeploymentsController.deleteDeployment(
        makeRequestObj({
          params: { id: "test_id" }
        }),
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
