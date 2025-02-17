import chalk from "chalk";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import {
  capitalizeComponentName,
  capitalizeFirstLetter,
  createDirectoryIfNotExists,
  getComponentsPaths,
  writeFile,
} from "../helpers";

jest.mock("fs");
jest.mock("chalk", () => ({
  __esModule: true,
  default: {
    blue: jest.fn((msg) => msg),
    green: jest.fn((msg) => msg),
  },
}));

describe("Helpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDirectoryIfNotExists", () => {
    beforeEach(() => {
      jest.spyOn(global.console, "log").mockImplementation(() => {});
    });

    it("should create directory if it does not exist", () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      createDirectoryIfNotExists("/path/to/dir");
      expect(mkdirSync).toHaveBeenCalledWith("/path/to/dir", {
        recursive: true,
      });
      expect(chalk.blue).toHaveBeenCalledWith(
        "Directory created: /path/to/dir"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Directory created: /path/to/dir"
      );
    });

    it("should not create directory if it exists", () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      createDirectoryIfNotExists("/path/to/dir");
      expect(mkdirSync).not.toHaveBeenCalled();
      expect(chalk.blue).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("writeFile", () => {
    beforeEach(() => {
      jest.spyOn(global.console, "log").mockImplementation(() => {});
    });

    it("should write file with trimmed content", () => {
      writeFile("/path/to/file", " content ");
      expect(writeFileSync).toHaveBeenCalledWith(
        "/path/to/file",
        "content",
        "utf8"
      );
      expect(chalk.green).toHaveBeenCalledWith("File created: /path/to/file");
      expect(console.log).toHaveBeenCalledWith("File created: /path/to/file");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("test")).toBe("Test");
    });
  });

  describe("capitalizeComponentName", () => {
    it("should capitalize each part of the component name", () => {
      expect(capitalizeComponentName("test/component")).toBe("Test/Component");
    });

    it("should return an empty string if componentName is undefined", () => {
      expect(capitalizeComponentName()).toBe("");
    });
  });

  describe("getComponentsPaths", () => {
    it("should return the correct paths for components", () => {
      const modulePath = "src/modules/testModule";
      const componentsNames = {
        component1: "Component1.tsx",
        component2: "Component2.tsx",
      };
      const expectedPaths = {
        component1: resolve(process.cwd(), modulePath, "Component1.tsx"),
        component2: resolve(process.cwd(), modulePath, "Component2.tsx"),
        baseDir: resolve(process.cwd(), modulePath),
      };
      expect(getComponentsPaths(modulePath, componentsNames)).toEqual(
        expectedPaths
      );
    });
  });
});
