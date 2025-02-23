import { createModule } from "../commands/createModule";
import { createPage } from "../commands/createPage";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index";

jest.mock("chalk", () => ({
  __esModule: true,
  default: {
    yellow: jest.fn((msg) => msg),
  },
}));
jest.mock("../helpers/index", () => ({
  capitalizeComponentPath: jest.fn((str?: string) =>
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
  PAGE_TEMPLATE: jest.fn(
    (page, pagePath) => `
import { FC } from "react";

import { ${page}Section } from "modules/${pagePath}";

interface ${page}PageProps {}

const ${page}Page: FC<${page}PageProps> = () => {
  return <${page}Section />;
};

export default ${page}Page;
  `
  ),
}));

jest.mock("../commands/createModule", () => ({
  createModule: jest.fn(),
}));

describe("createPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a page without a specified path", () => {
    const pageName = "Test";
    const options = {};

    createPage(pageName, options);

    const pagePath = "TestPage";
    const paths = {
      baseDir: `${process.cwd()}/src/pages/TestPage`,
      pageFile: `${process.cwd()}/src/pages/${pagePath}/index.tsx`,
    };

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(paths.baseDir);
    expect(writeFile).toHaveBeenCalledWith(paths.pageFile, expect.any(String));
    expect(createModule).toHaveBeenCalledWith(pageName, {
      full: true,
      startComponent: `${pageName}Section`,
    });
  });
});
