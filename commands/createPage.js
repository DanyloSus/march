import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  writeFile,
} from "../helpers/index.js";
import { createModule } from "./createModule.js";

export function createPage(pageName, options) {
  const pagePath = pageName.split("/").map(capitalizeComponentName).join("/");
  const page = capitalizeComponentName(pageName.split("/").pop());

  const paths = {
    pagesDir: resolve(process.cwd(), "src/pages"),
    pageFolderPath: join(
      resolve(process.cwd(), "src/pages"),
      `${pagePath}Page`
    ),
    pageFilePath: join(
      resolve(process.cwd(), "src/pages", `${pagePath}Page`),
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

import { ${page}Section } from "modules/${pagePath}";

interface ${page}PageProps {}

const ${page}Page: FC<${page}PageProps> = () => {
  return <${page}Section />;
};

export default ${page}Page;
    `,
  };

  // Write files
  writeFile(paths.pageFilePath, templates.pageTemplate);

  // Create the section component using createComponent
  createModule(pagePath, { full: true, startComponent: `${page}Section` });

  // Update APP_ROUTES in src/utils/index.ts
  if (options.path) {
    let utilsFileContent = existsSync(paths.utilsFilePath)
      ? readFileSync(paths.utilsFilePath, "utf8")
      : "";

    if (!utilsFileContent.includes("export const APP_ROUTES")) {
      utilsFileContent += `
export const APP_ROUTES = {};
      `;
    }

    const updatedUtilsFileContent = utilsFileContent.replace(
      /export const APP_ROUTES = {([^}]*)}/,
      (match, routes) => {
        return `export const APP_ROUTES = {
${routes.trim()}${
          routes.trim()[routes.trim().length - 1] === "," ||
          !routes.trim()[routes.trim().length - 1]
            ? ""
            : ","
        }${routes.trim() && "\n"}  ${
          page.charAt(0).toLowerCase() + page.slice(1)
        }: "${options.path}"
}`;
      }
    );
    writeFileSync(paths.utilsFilePath, updatedUtilsFileContent, "utf8");

    // Update Routing.tsx
    let routingFileContent = readFileSync(paths.routingFilePath, "utf8");

    // Add import statement for APP_ROUTES if it doesn't exist
    if (!routingFileContent.includes("import { APP_ROUTES }")) {
      routingFileContent = `import { APP_ROUTES } from 'utils';\n${routingFileContent}`;
    }

    const importStatement = `const ${page}Page = lazy(() => import('pages/${pagePath}Page'));\n`;
    const routeStatement = `      <Route path={APP_ROUTES.${
      page.charAt(0).toLowerCase() + page.slice(1)
    }} element={<LazyLoadPage children={<${page}Page />} />} />\n`;

    if (
      !routingFileContent.includes(`const ${page}Page = lazy(() => import(`)
    ) {
      routingFileContent = routingFileContent.replace(
        /(const Routing = \(\) => {\n)/,
        `${importStatement}\n$1`
      );
    }

    let updatedRoutingFileContent = routingFileContent;

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
      matchingLayoutName || baseLayoutPath
        ? `(<Route path={APP_ROUTES.${
            matchingLayoutName || baseLayoutPath
          }} element={<[^>]+>}>\n)`
        : `(<Routes>\n)`
    );

    if (
      !routingFileContent.includes(
        `element={<LazyLoadPage children={<${page}Page />} />}`
      )
    ) {
      updatedRoutingFileContent = updatedRoutingFileContent.replace(
        layoutRegex,
        `$1${matchingLayoutName || baseLayoutPath ? `  ` : ""}${routeStatement}`
      );
    }

    writeFileSync(paths.routingFilePath, updatedRoutingFileContent, "utf8");
  }
}
