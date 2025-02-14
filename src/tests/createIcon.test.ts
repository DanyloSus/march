import { ICON_TEMPLATE } from "../constants";

const { createIcon } = require("../commands/createIcon");
const {
  createDirectoryIfNotExists,
  writeFile,
  capitalizeComponentName,
  getComponentsPaths,
} = require("../helpers/index");

jest.mock("../helpers/index", () => ({
  createDirectoryIfNotExists: jest.fn(),
  writeFile: jest.fn(),
  capitalizeComponentName: jest.fn(
    (str) => str.charAt(0).toUpperCase() + str.slice(1)
  ),
  getComponentsPaths: jest.fn((modulePath, componentsNames) => ({
    baseDir: "/home/danylo/march-script/src/components/icons/TestIconIcon",
    icon: "/home/danylo/march-script/src/components/icons/TestIconIcon/TestIconIcon.tsx",
  })),
}));

describe("createIcon", () => {
  it("should create a directory and write a file with the correct template", () => {
    const iconName = "testIcon";
    createIcon(iconName);

    const capitalizedIconName = "TestIconIcon";
    const baseDir = `/home/danylo/march-script/src/components/icons/${capitalizedIconName}`;

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(baseDir);

    const expectedFilePath = `${baseDir}/${capitalizedIconName}.tsx`;

    expect(writeFile).toHaveBeenCalledWith(
      expectedFilePath,
      expect.any(String)
    );

    const expectedTemplate = ICON_TEMPLATE(capitalizedIconName);

    // Normalize both expected and actual strings for comparison
    const normalizeString = (str: string) =>
      str.trim().replace(/\s+/g, " ").replace(/\n\s*/g, "\n");

    expect(normalizeString(writeFile.mock.calls[0][1])).toBe(
      normalizeString(expectedTemplate)
    );
  });
});
