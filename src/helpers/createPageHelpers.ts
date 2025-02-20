import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { getComponentsPaths, writeFile } from "./index.js";

const updateUtils = (
  utilsFilePath: string,
  pageName: string,
  pagePath: string,
  changePageName: (newPageName: string) => void
) => {
  let utilsFileContent = existsSync(utilsFilePath)
    ? readFileSync(utilsFilePath, "utf8")
    : "";

  if (!utilsFileContent.includes("export const APP_ROUTES")) {
    utilsFileContent += `
export const APP_ROUTES = {};
            `;
  }

  const appRoutesMatch = utilsFileContent.match(
    /export const APP_ROUTES = {([^}]*)}/
  );
  const routes = appRoutesMatch ? appRoutesMatch[1].split("\n") : [];
  let newPageName = pageName;
  let counter = 1;

  while (
    routes.some((route) =>
      route.includes(
        `${newPageName.charAt(0).toLowerCase() + newPageName.slice(1)}:`
      )
    )
  ) {
    newPageName = `${pageName}${counter}`;
    counter++;
  }

  if (newPageName !== pageName) {
    console.log(
      chalk.yellow(
        `Warning: The path "${pagePath}" already exists. Renaming to "${newPageName}".`
      )
    );
    changePageName(newPageName);
  }

  return utilsFileContent.replace(
    /export const APP_ROUTES = {([^}]*)}/,
    (match, routes) => {
      return `export const APP_ROUTES = {
  ${routes.trim()}${
        routes.trim()[routes.trim().length - 1] === "," ||
        !routes.trim()[routes.trim().length - 1]
          ? ""
          : ","
      }${routes.trim() && "\n"}  ${
        newPageName.charAt(0).toLowerCase() + newPageName.slice(1)
      }: "${pagePath}"
}`;
    }
  );
};

const updateRouting = (
  utilsFilePath: string,
  routingFilePath: string,
  pageName: string,
  pagePath: string
) => {
  let utilsFileContent = existsSync(utilsFilePath)
    ? readFileSync(utilsFilePath, "utf8")
    : "";

  // Update Routing.tsx
  let routingFileContent = readFileSync(routingFilePath, "utf8");

  // Add import statement for APP_ROUTES if it doesn't exist
  if (!routingFileContent.includes("import { APP_ROUTES }")) {
    routingFileContent = `import { APP_ROUTES } from 'utils';\n${routingFileContent}`;
  }

  const importStatement = `const ${pageName}Page = lazy(() => import('pages/${pagePath}Page'));\n`;
  const routeStatement = `      <Route path={APP_ROUTES.${
    pageName.charAt(0).toLowerCase() + pageName.slice(1)
  }} element={<LazyLoadPage children={<${pageName}Page />} />} />\n`;

  if (
    !routingFileContent.includes(`const ${pageName}Page = lazy(() => import(`)
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
  const appRoutesMatchResult = utilsFileContent.match(
    /export const APP_ROUTES = {([^}]*)}/
  );
  const appRoutesMatch = appRoutesMatchResult
    ? appRoutesMatchResult[1].split("\n")
    : [];
  let baseLayoutPath;
  const layoutsPaths: { [key: string]: string }[] = [];
  nonLazyLoadPaths.forEach((path) => {
    const pathOfThePaths = appRoutesMatch.findIndex((route) =>
      route.includes(`${path}:`)
    );
    if (pathOfThePaths) {
      const pathMatch = appRoutesMatch[pathOfThePaths].match(/"([^"]+)"/);
      const pathValue = pathMatch ? pathMatch[1] : "";
      if (pathValue === "/") {
        baseLayoutPath = path;
      } else {
        layoutsPaths.push({ [path]: pathValue });
      }
    }
  });

  const matchingLayout = layoutsPaths.find((layout) => {
    const layoutPathValue = Object.values(layout ?? {})[0];
    return pagePath?.startsWith(layoutPathValue);
  });

  const matchingLayoutName = Object.keys(matchingLayout ?? {})[0];

  const layoutMatch = pagePath.match(/^\/([^/]+)/);
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
      `element={<LazyLoadPage children={<${pageName}Page />} />}`
    )
  ) {
    updatedRoutingFileContent = updatedRoutingFileContent.replace(
      layoutRegex,
      `$1${matchingLayoutName || baseLayoutPath ? `  ` : ""}${routeStatement}`
    );
  }

  return updatedRoutingFileContent;
};

export const connectPage = (startPageName: string, pagePath: string) => {
  let pageName = startPageName;

  const changePageName = (newPageName: string) => {
    pageName = newPageName;
  };

  const utilsPaths = getComponentsPaths("src/utils", {
    utilsFile: "index.ts",
  });

  const utilsFilePath = utilsPaths.utilsFile;

  const utilsFileContent = updateUtils(
    utilsFilePath,
    pageName,
    pagePath,
    changePageName
  );

  writeFile(utilsFilePath, utilsFileContent);

  const routingPaths = getComponentsPaths("src/", {
    routingFile: "Routing.tsx",
  });

  const routingFilePath = routingPaths.routingFile;

  const routingFileContent = updateRouting(
    utilsFilePath,
    routingFilePath,
    pageName,
    pagePath
  );

  writeFile(routingFilePath, routingFileContent);
};
