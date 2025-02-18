import { ICON_TEMPLATE } from "../constants/index";

import { createIcon } from "../commands/createIcon";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  getComponentsPaths,
  writeFile,
} from "../helpers/index";

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
  it("should create a directory and write a file with the correct template", () => {
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

  it("should capitalize the name", () => {
    const componentName = "component";
    const result = capitalizeComponentName(componentName);
    expect(result).toBe("Component");
  });

  it("should return the correct paths for components", () => {
    const modulePath = "src/modules/testModule";
    const componentsNames = {
      component1: "Component1.tsx",
      component2: "Component2.tsx",
    };

    const expectedPaths = {
      component1: `${process.cwd()}/src/modules/testModule/Component1.tsx`,
      component2: `${process.cwd()}/src/modules/testModule/Component2.tsx`,
      baseDir: `${process.cwd()}/src/modules/testModule`,
    };

    const result = getComponentsPaths(modulePath, componentsNames);
    expect(result).toEqual(expectedPaths);
  });
});
