import { readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index.js";
import { createModule } from "./createModule.js";

export function createPage(pageName, options) {
  const paths = {
    pagesDir: resolve(process.cwd(), "src/pages"),
    pageFolderPath: join(
      resolve(process.cwd(), "src/pages"),
      `${pageName}Page`
    ),
    pageFilePath: join(
      resolve(process.cwd(), "src/pages", `${pageName}Page`),
      "index.tsx"
    ),
    utilsFilePath: resolve(process.cwd(), "src/utils/index.ts"),
    routingFilePath: resolve(process.cwd(), "src/Routing.tsx"),
  };

  // Create necessary directories
  createDirectoryIfNotExists(paths.pagesDir);
  createDirectoryIfNotExists(paths.pageFolderPath);

  // Templates for the files
  const templates = {
    pageTemplate: `
import { FC } from "react";

import { ${pageName}Section } from "modules/${pageName}";

interface ${pageName}PageProps {}

const ${pageName}Page: FC<${pageName}PageProps> = () => {
  return <${pageName}Section />;
};

export default ${pageName}Page;
    `,
  };

  // Write files
  writeFile(paths.pageFilePath, templates.pageTemplate);

  // Create the section component using createComponent
  createModule(pageName, { full: true });

  // Update APP_ROUTES in src/utils/index.tsx
  if (options.path) {
    const utilsFileContent = readFileSync(paths.utilsFilePath, "utf8");
    const updatedUtilsFileContent = utilsFileContent.replace(
      /export const APP_ROUTES = {([^}]*)}/,
      (match, routes) => {
        return `export const APP_ROUTES = {
  ${routes.trim()}${routes.trim()[routes.trim().length - 1] === "," ? "" : ","}
  ${pageName.toLowerCase()}: "${options.path}"
}`;
      }
    );
    writeFileSync(paths.utilsFilePath, updatedUtilsFileContent, "utf8");
  }

  // Update Routing.tsx
  const routingFileContent = readFileSync(paths.routingFilePath, "utf8");
  const importStatement = `const ${pageName}Page = lazy(() => import('pages/${pageName}Page'));\n`;
  const routeStatement = `<Route path={APP_ROUTES.${pageName.toLowerCase()}} element={<LazyLoadPage children={<${pageName}Page />} />} />\n`;

  let updatedRoutingFileContent = routingFileContent.replace(
    /(const Routing = \(\) => {\n)/,
    `${importStatement}\n$1`
  );

  // Find all paths that have element and it is not LazyLoadPage
  const nonLazyLoadPaths = [];
  const routeRegex = /<Route path={APP_ROUTES\.([^}]+)}/g;
  let match;
  while ((match = routeRegex.exec(routingFileContent)) !== null) {
    if (!match[2]?.includes("LazyLoadPage")) {
      nonLazyLoadPaths.push(match[1]);
    }
  }

  // Get values from APP_ROUTES by the nonLazyLoadPaths
  const utilsFileContent = readFileSync(paths.utilsFilePath, "utf8");
  const appRoutesMatch = utilsFileContent
    .match(/export const APP_ROUTES = {([^}]*)}/)
    .slice(1)[0]
    .split("\n");
  let baseLayoutPath;
  const layoutsPaths = [];
  nonLazyLoadPaths.forEach((path) => {
    const pathOfThePaths = appRoutesMatch.findIndex((route) =>
      route.includes(`${path}:`)
    );
    if (pathOfThePaths) {
      const pathValue = appRoutesMatch[pathOfThePaths].match(/"([^"]+)"/)[1];
      if (pathValue === "/") {
        baseLayoutPath = path;
      } else {
        layoutsPaths.push({ [path]: pathValue });
      }
    }
  });

  const matchingLayout = layoutsPaths.find((layout) => {
    const layoutPathValue = Object.values(layout ?? {})[0];
    return options.path.startsWith(layoutPathValue);
  });

  const matchingLayoutName = Object.keys(matchingLayout ?? {})[0];

  const layoutMatch = options.path.match(/^\/([^/]+)/);
  const layoutPath = layoutMatch ? layoutMatch[1] : "base";
  const layoutRegex = new RegExp(
    `(<Route path={APP_ROUTES.${
      matchingLayoutName || baseLayoutPath
    }} element={<[^>]+>}>\n)`
  );

  updatedRoutingFileContent = updatedRoutingFileContent.replace(
    layoutRegex,
    `$1${routeStatement}`
  );

  writeFileSync(paths.routingFilePath, updatedRoutingFileContent, "utf8");
}
