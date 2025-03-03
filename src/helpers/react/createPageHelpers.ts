import { existsSync, readFileSync } from "fs";
import { PagesInterface } from "../../constants/types.js";
import {
  ensureNamePrefix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  writeFile,
} from "../index.js";

const APP_ROUTES_DECLARATION = "export const APP_ROUTES = {";

/**
 * Ensures the APP_ROUTES object exists in the utils file and adds a new route if not already present.
 */
export const updateUtils = (
  utilsFilePath: string,
  pageName: string,
  pageRoute: string
) => {
  let utilsFileContent = existsSync(utilsFilePath)
    ? readFileSync(utilsFilePath, "utf8")
    : "";

  if (!utilsFileContent.includes(APP_ROUTES_DECLARATION)) {
    utilsFileContent += `${APP_ROUTES_DECLARATION}};\n`;
  }

  const formattedPageName = formatPageName(pageName);
  const newRouteEntry = `${formattedPageName}: "${pageRoute}"`;

  if (!utilsFileContent.includes(newRouteEntry)) {
    utilsFileContent = addRouteToAppRoutes(utilsFileContent, newRouteEntry);
  }

  return utilsFileContent;
};

/**
 * Ensures APP_ROUTES and LazyLoadPage imports are added to the routing file, and adds a new route.
 */
export const updateRouting = (
  utilsFilePath: string,
  routingFilePath: string,
  pageName: string,
  pageRoute: string,
  pagePath: string
) => {
  let utilsFileContent = readFileSync(utilsFilePath, "utf8");
  let routingFileContent = readFileSync(routingFilePath, "utf8");

  const relativeUtilsFilePath = utilsFilePath
    .replace(/^.*src\//, "")
    .replace(/\.ts$/, "");
  routingFileContent = ensureAppRoutesImport(
    routingFileContent,
    relativeUtilsFilePath
  );

  const formattedPageName = formatPageName(pageName);
  const importStatement = `const ${pageName} = lazy(() => import('pages/${pagePath}'));\n\n`;
  const routeStatement = `      <Route path={APP_ROUTES.${formattedPageName}} element={<LazyLoadPage children={<${pageName} />} />} />\n\n`;

  if (!routingFileContent.includes(importStatement)) {
    routingFileContent = ensureLazyLoadPageImport(
      routingFileContent,
      pageName,
      importStatement
    );
  }

  const nonLazyLoadPaths = findNonLazyLoadPaths(routingFileContent);
  const { baseLayoutPath, layoutsPaths } = extractLayoutPaths(
    utilsFileContent,
    nonLazyLoadPaths
  );
  const matchingLayoutName = findMatchingLayout(
    layoutsPaths,
    pageRoute,
    baseLayoutPath
  );

  if (
    !routingFileContent.includes(
      `element={<LazyLoadPage children={<${pageName} />} />}`
    )
  ) {
    const layoutRegex = new RegExp(
      matchingLayoutName
        ? `<Route path={APP_ROUTES.${matchingLayoutName}} element={<[^>]+>}>
`
        : "<Routes>\n"
    );
    routingFileContent = routingFileContent.replace(
      layoutRegex,
      `$&${routeStatement}`
    );
  }

  return routingFileContent;
};

/**
 * Connects a page by updating utils and routing files.
 */
export const connectPage = (
  pageName: string,
  startPageRoute: string,
  pagePath: string
) => {
  const pageSettings = getProjectSettingsOrDefault("pages") as PagesInterface;

  const pageRoute = ensureNamePrefix(startPageRoute, "/");

  const utilsPaths = getComponentsPaths("", {
    utilsFile: pageSettings.appRoutesDirectory,
  });
  const utilsFilePath = utilsPaths.utilsFile;

  if (pageSettings.doesAddRouteToAppRoutes) {
    const utilsFileContent = updateUtils(utilsFilePath, pageName, pageRoute);
    writeFile(utilsFilePath, utilsFileContent);
  }

  const routingPaths = getComponentsPaths("", {
    routingFile: pageSettings.routingDirectory,
  });
  const routingFilePath = routingPaths.routingFile;

  if (pageSettings.doesAddRouteToRouting) {
    const routingFileContent = updateRouting(
      utilsFilePath,
      routingFilePath,
      pageName,
      pageRoute,
      pagePath
    );
    writeFile(routingFilePath, routingFileContent);
  }

  if (pageSettings.hasPageStyles) {
    const stylesFilePath = `src/pages/${pagePath}/styles.ts`;
    const pageStyleTemplate = getTemplateContentWithName({
      templateName: "componentStyle.ts",
      capitalizeName: pageName,
      uncapitalizeName: formatPageName(pageName),
      path: pagePath,
    });
    writeFile(stylesFilePath, pageStyleTemplate);
  }
};

const formatPageName = (pageName: string) => {
  return pageName.charAt(0).toLowerCase() + pageName.slice(1);
};

const addRouteToAppRoutes = (content: string, newRouteEntry: string) => {
  return content.replace(
    /export const APP_ROUTES = {([\s\S]*?)};/,
    (_, routes) => {
      const trimmedRoutes = routes.trim();
      return `${APP_ROUTES_DECLARATION}${
        trimmedRoutes
          ? `\n  ${trimmedRoutes}${
              trimmedRoutes.endsWith(",") ? "" : ","
            }\n  ${newRouteEntry}`
          : `\n  ${newRouteEntry}`
      }\n};`;
    }
  );
};

const ensureAppRoutesImport = (content: string, appRoutesPath: string) => {
  if (!content.includes("import { APP_ROUTES }")) {
    content = `import { APP_ROUTES } from '${appRoutesPath}';\n\n${content}`;
  }
  return content;
};

const ensureLazyLoadPageImport = (
  content: string,
  pageName: string,
  importStatement: string
) => {
  if (!content.includes(`const ${pageName}Page`)) {
    content = content.replace(
      /(const Routing = \(\) => {\n)/,
      `${importStatement}$1`
    );
  }
  return content;
};

const findNonLazyLoadPaths = (routingFileContent: string) => {
  const nonLazyLoadPaths = [];
  const routeRegex =
    /<Route path={APP_ROUTES\.([^}]+)} element={<([^>]+)>}>[\s\S]*?<\/Route>/g;
  let match;
  while ((match = routeRegex.exec(routingFileContent)) !== null) {
    if (!match[2]?.includes("LazyLoadPage")) {
      nonLazyLoadPaths.push(match[1]);
    }
  }
  return nonLazyLoadPaths;
};

const extractLayoutPaths = (
  utilsFileContent: string,
  nonLazyLoadPaths: string[]
) => {
  const appRoutesMatchResult = utilsFileContent.match(
    /export const APP_ROUTES = {([\s\S]*?)};/
  );
  const appRoutesMatch = appRoutesMatchResult
    ? appRoutesMatchResult[1].split("\n")
    : [];

  let baseLayoutPath: string | undefined;
  const layoutsPaths: { [x: string]: string }[] = [];

  nonLazyLoadPaths.forEach((path: string) => {
    const pathOfThePaths = appRoutesMatch.findIndex((route) =>
      route.includes(`${path}:`)
    );
    if (pathOfThePaths !== -1) {
      const pathMatch = appRoutesMatch[pathOfThePaths].match(/"([^"]+)"/);
      const pathValue = pathMatch ? pathMatch[1] : "";

      if (pathValue === "/") {
        baseLayoutPath = path;
      } else {
        layoutsPaths.push({ [path]: pathValue });
      }
    }
  });

  return { baseLayoutPath, layoutsPaths };
};

const findMatchingLayout = (
  layoutsPaths: {
    [x: string]: string;
  }[],
  pageRoute: string,
  baseLayoutPath?: string
) => {
  const matchingLayout = layoutsPaths.find((layout) => {
    const layoutPathValue = Object.values(layout ?? {})[0];
    return pageRoute?.startsWith(layoutPathValue);
  });

  return Object.keys(matchingLayout ?? {})[0] || baseLayoutPath;
};
