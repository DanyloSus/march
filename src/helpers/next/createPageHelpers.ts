import { existsSync, readFileSync } from "fs";
import { getComponentsPaths, writeFile } from "../index.js";

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
 * Connects a page by updating utils and routing files.
 */
export const connectPage = (
  pageName: string,
  startPageRoute: string,
  pagePath: string
) => {
  const pageRoute = startPageRoute.startsWith("/")
    ? startPageRoute
    : `/${startPageRoute}`;
  const utilsPaths = getComponentsPaths("src/utils", { utilsFile: "index.ts" });
  const utilsFilePath = utilsPaths.utilsFile;

  const utilsFileContent = updateUtils(utilsFilePath, pageName, pageRoute);
  writeFile(utilsFilePath, utilsFileContent);
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
          ? `\n  ${trimmedRoutes},\n  ${newRouteEntry}`
          : `\n  ${newRouteEntry}`
      }\n};`;
    }
  );
};
