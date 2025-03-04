import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { writeFile } from "../helpers/index";
import { connectPage } from "../helpers/react/createPageHelpers.js";

jest.mock("fs");
jest.mock("chalk", () => ({
  __esModule: true,
  default: {
    yellow: jest.fn((msg) => msg),
  },
}));
jest.mock("../helpers/index", () => ({
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

describe("createPageHelpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUtils", () => {
    it("should add a new route to APP_ROUTES", () => {
      const utilsFilePath = "/path/to/utils/index.ts";
      const pageName = "TestPage";
      const pagePath = "/test-page";

      (existsSync as jest.Mock).mockReturnValue(true);
      (readFileSync as jest.Mock).mockReturnValue(`
export const APP_ROUTES = {
  base: "/",
  home: "/",
};`);

      expect(chalk.yellow).not.toHaveBeenCalled();
    });
  });

  describe("updateRouting", () => {
    it("should add a new route to Routing.tsx", () => {
      const utilsFilePath = "/path/to/utils/index.ts";
      const routingFilePath = "/path/to/Routing.tsx";
      const pageName = "TestPage";
      const pageRoute = "/test-page";
      const pagePath = "testPage";

      (existsSync as jest.Mock).mockReturnValue(true);
      (readFileSync as jest.Mock).mockReturnValue(`
import { APP_ROUTES } from 'utils';

const Routing = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.base} element={<BasePage />} />
    </Routes>
  );
};`);
    });
  });

  describe("connectPage", () => {
    it("should connect a new page", () => {
      const pageName = "TestPage";
      const startPageRoute = "/test-page";
      const pagePath = "testPage";

      (existsSync as jest.Mock).mockReturnValue(true);
      (readFileSync as jest.Mock).mockReturnValue(`
import { APP_ROUTES } from 'utils';
export const APP_ROUTES = {
  base: "/",
  home: "/"
};
const Routing = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<HomePage />} />
    </Routes>
  );
};`);

      connectPage(pageName, startPageRoute, pagePath);

      expect(writeFile).toHaveBeenCalledTimes(2);
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining("utils/index.ts"),
        expect.stringContaining(`testPage: "${startPageRoute}"`)
      );
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining("Routing.tsx"),
        expect.stringContaining(
          `const TestPagePage = lazy(() => import('pages/${pagePath}Page'));`
        )
      );
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining("Routing.tsx"),
        expect.stringContaining(
          `<Route path={APP_ROUTES.testPage} element={<LazyLoadPage children={<TestPagePage />} />} />`
        )
      );
    });
  });
});
