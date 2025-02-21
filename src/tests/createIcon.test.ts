import { ICON_TEMPLATE } from "../constants/index";

import { createIcon } from "../commands/createIcon";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index";

jest.mock("../helpers/index", () => ({
  createDirectoryIfNotExists: jest.fn(),
  writeFile: jest.fn(),
  capitalizeComponentName: jest.fn(
    (str) => str.charAt(0).toUpperCase() + str.slice(1)
  ),
  getComponentsPaths: jest.fn((modulePath, componentsNames) => {
    const baseDir = `${process.cwd()}/${modulePath}`;
    const paths = Object.keys(componentsNames).reduce((acc, componentName) => {
      acc[componentName] = `${baseDir}/${componentsNames[componentName]}`;
      return acc;
    }, {} as any);
    paths["baseDir"] = baseDir;
    return paths;
  }),
}));

describe("createIcon", () => {
  it("should create a directory and write an icon with the correct template", () => {
    const iconName = "testIcon";
    createIcon(iconName);

    const capitalizedIconName = "TestIconIcon";
    const baseDir = `${process.cwd()}/src/components/icons/${capitalizedIconName}`;

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

    expect(normalizeString((writeFile as jest.Mock).mock.calls[0][1])).toBe(
      normalizeString(expectedTemplate)
    );
  });
});
