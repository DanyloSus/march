import { createComponent } from "../commands/createComponent";
import { createModule } from "../commands/createModule";
import {
  API_TEMPLATE,
  CONSTANTS_TEMPLATE,
  MAIN_IMPORT_TEMPLATE,
} from "../constants/index";
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
  API_TEMPLATE: jest.fn(
    (moduleName) => `
import api from "api/axios";

const ${moduleName.charAt(0).toLowerCase() + moduleName.slice(1)}Api = {
// write your api
};

export default ${moduleName.charAt(0).toLowerCase() + moduleName.slice(1)}Api;
  `
  ),
  CONSTANTS_TEMPLATE: `
export const DUMMY_DATA = "dummy data";
  `,
  MAIN_IMPORT_TEMPLATE: jest.fn(
    (startComponent) => `
export { ${startComponent} } from "./components/${startComponent}";
  `
  ),
}));

jest.mock("../commands/createComponent", () => ({
  createComponent: jest.fn(),
}));

describe("createModule", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a module with the specified start component", () => {
    const moduleName = "testModule";
    const options = { startComponent: "TestComponent" };

    createModule(moduleName, options);

    const modulePath = "TestModule";
    const startComponent = "TestComponent";
    const paths = {
      mainModule: `${process.cwd()}/src/modules/${modulePath}/index.ts`,
      api: `${process.cwd()}/src/modules/${modulePath}/api/testModuleApi.ts`,
      constants: `${process.cwd()}/src/modules/${modulePath}/constants/index.ts`,
      hooks: `${process.cwd()}/src/modules/${modulePath}/hooks`,
      store: `${process.cwd()}/src/modules/${modulePath}/store`,
      helpers: `${process.cwd()}/src/modules/${modulePath}/helpers`,
      baseDir: `${process.cwd()}/src/modules/${modulePath}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.baseDir);
    expect(writeFile).toHaveBeenCalledWith(
      paths.mainModule,
      MAIN_IMPORT_TEMPLATE(startComponent)
    );
    expect(createComponent).toHaveBeenCalledWith(startComponent, {
      module: modulePath,
    });
  });

  it("should create a full module with all components", () => {
    const moduleName = "testModule";
    const options = { full: true, startComponent: "TestComponent" };

    createModule(moduleName, options);

    const modulePath = "TestModule";
    const startComponent = "TestComponent";
    const paths = {
      mainModule: `${process.cwd()}/src/modules/${modulePath}/index.ts`,
      api: `${process.cwd()}/src/modules/${modulePath}/api/testModuleApi.ts`,
      constants: `${process.cwd()}/src/modules/${modulePath}/constants/index.ts`,
      hooks: `${process.cwd()}/src/modules/${modulePath}/hooks`,
      store: `${process.cwd()}/src/modules/${modulePath}/store`,
      helpers: `${process.cwd()}/src/modules/${modulePath}/helpers`,
      baseDir: `${process.cwd()}/src/modules/${modulePath}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.baseDir);
    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.api);
    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.constants);
    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.hooks);
    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.store);
    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.helpers);

    expect(writeFile).toHaveBeenCalledWith(paths.api, API_TEMPLATE(modulePath));
    expect(writeFile).toHaveBeenCalledWith(paths.constants, CONSTANTS_TEMPLATE);
    expect(writeFile).toHaveBeenCalledWith(
      paths.mainModule,
      MAIN_IMPORT_TEMPLATE(startComponent)
    );
    expect(createComponent).toHaveBeenCalledWith(startComponent, {
      module: modulePath,
    });
  });

  it("should create a module with the default start component if none is specified", () => {
    const moduleName = "testModule";
    const options = {};

    createModule(moduleName, options);

    const modulePath = "TestModule";
    const startComponent = "TestModule";
    const paths = {
      mainModule: `${process.cwd()}/src/modules/${modulePath}/index.ts`,
      api: `${process.cwd()}/src/modules/${modulePath}/api/testModuleApi.ts`,
      constants: `${process.cwd()}/src/modules/${modulePath}/constants/index.ts`,
      hooks: `${process.cwd()}/src/modules/${modulePath}/hooks`,
      store: `${process.cwd()}/src/modules/${modulePath}/store`,
      helpers: `${process.cwd()}/src/modules/${modulePath}/helpers`,
      baseDir: `${process.cwd()}/src/modules/${modulePath}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.baseDir);
    expect(writeFile).toHaveBeenCalledWith(
      paths.mainModule,
      MAIN_IMPORT_TEMPLATE(startComponent)
    );
    expect(createComponent).toHaveBeenCalledWith(startComponent, {
      module: modulePath,
    });
  });

  it("should create a nested module with the default start component", () => {
    const moduleName = "testModules/testModule";
    const options = {};

    createModule(moduleName, options);

    const modulePath = "TestModules/TestModule";
    const startComponent = "TestModule";
    const paths = {
      mainModule: `${process.cwd()}/src/modules/${modulePath}/index.ts`,
      api: `${process.cwd()}/src/modules/${modulePath}/api/testModuleApi.ts`,
      constants: `${process.cwd()}/src/modules/${modulePath}/constants/index.ts`,
      hooks: `${process.cwd()}/src/modules/${modulePath}/hooks`,
      store: `${process.cwd()}/src/modules/${modulePath}/store`,
      helpers: `${process.cwd()}/src/modules/${modulePath}/helpers`,
      baseDir: `${process.cwd()}/src/modules/${modulePath}`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.baseDir);
    expect(writeFile).toHaveBeenCalledWith(
      paths.mainModule,
      MAIN_IMPORT_TEMPLATE(startComponent)
    );
    expect(createComponent).toHaveBeenCalledWith(startComponent, {
      module: modulePath,
    });
  });
});
