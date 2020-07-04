import * as DeploymentsController from "../DeploymentsController";
import { Request, Response } from "express";

describe("DeploymentsController", () => {
  describe("getDeployments", () => {
    it("should return correct value", () => {
      const jsonMock = jest.fn();
      DeploymentsController.getDeployments(
        {} as Request,
        ({ json: jsonMock } as unknown) as Response,
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("addDeployment", () => {
    it("should return correct value", () => {
      const jsonMock = jest.fn();
      DeploymentsController.addDeployment(
        ({ params: { id: "test_id" } } as unknown) as Request,
        ({ json: jsonMock } as unknown) as Response,
        jest.fn()
      );

      expect(jsonMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith({ param: "test_id", status: "OK" });
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
