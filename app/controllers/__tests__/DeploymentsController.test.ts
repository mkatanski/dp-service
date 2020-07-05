import * as DeploymentsController from "../DeploymentsController";
import { Request, Response } from "express";

import { DeploymentModel } from "../../models/deployment";

jest.mock("../../models/deployment", () => ({
  DeploymentModel: jest.fn()
}));

interface ModelMock extends jest.Mock {
  find: jest.Mock;
}

const DeploymentModelMock = (DeploymentModel as unknown) as ModelMock;

describe("DeploymentsController", () => {
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const makeResponseObj = (): Response =>
    (({ status: statusMock, json: jsonMock } as unknown) as Response);

  const makeRequestObj = ({
    body,
    params
  }: {
    body?: Record<string, string>;
    params?: Record<string, string>;
  }): Request =>
    (({
      body,
      params
    } as unknown) as Request);

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    DeploymentModelMock.find = jest.fn();
  });

  describe("getDeployments", () => {
    it("should return correct value", async () => {
      DeploymentModelMock.find = jest.fn(cb => {
        cb(null, { test: "test" });
      });

      await DeploymentsController.getDeployments(
        makeRequestObj({}),
        makeResponseObj(),
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({
        items: {
          test: "test"
        }
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
  });

  describe("deleteDeployment", () => {
    it("should return correct value", () => {
      const jsonMock = jest.fn();
      DeploymentsController.deleteDeployment(
        ({ params: { id: "test_id" } } as unknown) as Request,
        ({ json: jsonMock } as unknown) as Response,
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({ param: "test_id", status: "OK" });
    });
  });
});
