import { createComponent } from "../commands/createComponent";
import { COMPONENT_TEMPLATE, STYLES_TEMPLATE } from "../constants/index";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index";

jest.mock("../helpers/index", () => ({
  capitalizeComponentName: jest.fn((str?: string) =>
    str
      ? str
          .split("/")
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("/")
      : ""
  ),
  createDirectoryIfNotExists: jest.fn(),
  getComponentsPaths: jest.fn((modulePath, componentsNames) => {
    const baseDir = `${process.cwd()}/${modulePath}`;
    const paths = Object.keys(componentsNames).reduce((acc, componentName) => {
      acc[componentName] = `${baseDir}/${componentsNames[componentName]}`;
      return acc;
    }, {} as { [key: string]: string });
    paths["baseDir"] = baseDir;
    return paths;
  }),
  writeFile: jest.fn(),
}));

jest.mock("../constants/index", () => ({
  COMPONENT_TEMPLATE: jest.fn(
    (componentName) => `
import { FC } from "react";

import { Box } from "ui/Box";

import { styles } from "./styles";

interface ${componentName}Props {
    // Add your props here
}

export const ${componentName}: FC<${componentName}Props> = () => {
    return (
        <Box sx={styles.root}>
          Dummy component
        </Box>
    );
};
  `
  ),
  STYLES_TEMPLATE: `
import { SxStyles } from "types/styles";

export const styles: SxStyles = {
    root: { },
};
  `,
}));

describe("createComponent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a component in the specified module", () => {
    const componentName = "TestComponent";
    const options = { module: "testModule" };

    createComponent(componentName, options);

    const moduleName = "TestModule";
    const capitalizedComponentName = "TestComponent";
    const componentFilePaths = {
      component: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}/index.tsx`,
      styles: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}/styles.ts`,
      baseDir: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(
      componentFilePaths.baseDir
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expect.any(String)
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      expect.any(String)
    );

    const expectedComponentTemplate = COMPONENT_TEMPLATE(
      capitalizedComponentName
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expectedComponentTemplate
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      STYLES_TEMPLATE
    );
  });

  it("should create a component in the components directory if no module is specified", () => {
    const componentName = "TestComponent";
    const options = {};

    createComponent(componentName, options);

    const capitalizedComponentName = "TestComponent";
    const componentFilePaths = {
      component: `${process.cwd()}/src/components/${capitalizedComponentName}/index.tsx`,
      styles: `${process.cwd()}/src/components/${capitalizedComponentName}/styles.ts`,
      baseDir: `${process.cwd()}/src/components/${capitalizedComponentName}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(
      componentFilePaths.baseDir
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expect.any(String)
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      expect.any(String)
    );

    const expectedComponentTemplate = COMPONENT_TEMPLATE(
      capitalizedComponentName
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expectedComponentTemplate
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      STYLES_TEMPLATE
    );
  });

  it("should create a nested component in the specified module", () => {
    const componentName = "Nested/Component";
    const options = { module: "testModule" };

    createComponent(componentName, options);

    const moduleName = "TestModule";
    const capitalizedComponentName = "Nested/Component";
    const componentFilePaths = {
      component: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}/index.tsx`,
      styles: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}/styles.ts`,
      baseDir: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(
      componentFilePaths.baseDir
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expect.any(String)
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      expect.any(String)
    );

    const expectedComponentTemplate = COMPONENT_TEMPLATE(
      capitalizedComponentName.split("/").pop()!
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expectedComponentTemplate
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      STYLES_TEMPLATE
    );
  });

  it("should create a nested component in the specified nested module", () => {
    const componentName = "Nested/Component";
    const options = { module: "testModules/testModule" };

    createComponent(componentName, options);

    const moduleName = "TestModules/TestModule";
    const capitalizedComponentName = "Nested/Component";
    const componentFilePaths = {
      component: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}/index.tsx`,
      styles: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}/styles.ts`,
      baseDir: `${process.cwd()}/src/modules/${moduleName}/components/${capitalizedComponentName}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(
      componentFilePaths.baseDir
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expect.any(String)
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      expect.any(String)
    );

    const expectedComponentTemplate = COMPONENT_TEMPLATE(
      capitalizedComponentName.split("/").pop()!
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expectedComponentTemplate
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      STYLES_TEMPLATE
    );
  });

  it("should create a nested component in the components directory if no module is specified", () => {
    const componentName = "Nested/Component";
    const options = {};

    createComponent(componentName, options);

    const capitalizedComponentName = "Nested/Component";
    const componentFilePaths = {
      component: `${process.cwd()}/src/components/${capitalizedComponentName}/index.tsx`,
      styles: `${process.cwd()}/src/components/${capitalizedComponentName}/styles.ts`,
      baseDir: `${process.cwd()}/src/components/${capitalizedComponentName}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(
      componentFilePaths.baseDir
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expect.any(String)
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      expect.any(String)
    );

    const expectedComponentTemplate = COMPONENT_TEMPLATE(
      capitalizedComponentName.split("/").pop()!
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.component,
      expectedComponentTemplate
    );
    expect(writeFile).toHaveBeenCalledWith(
      componentFilePaths.styles,
      STYLES_TEMPLATE
    );
  });
});
