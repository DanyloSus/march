import { existsSync, readFileSync } from "fs";
import { PagesInterface } from "../../constants/types.js";
import {
  getComponentsPaths,
  getProjectSettingsOrDefault,
  writeFile,
} from "../index.js";

const APP_ROUTES_DECLARATION = "export const APP_ROUTES = {";

/**
 * Ensures the APP_ROUTES object exists in the utils file and adds a new route if not already present.
 */
export const updateUtils = (
  utilsFilePath: string,
  pageName: string,
  startPageRoute: string
) => {
  let utilsFileContent = existsSync(utilsFilePath)
    ? readFileSync(utilsFilePath, "utf8")
    : "";

  if (!utilsFileContent.includes(APP_ROUTES_DECLARATION)) {
    utilsFileContent += `${APP_ROUTES_DECLARATION}};\n`;
  }

  const formattedPageName = formatPageName(pageName);
  const newRouteEntry = `${formattedPageName}: "${startPageRoute}"`;

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
  const pageSettings = getProjectSettingsOrDefault("pages") as PagesInterface;

  const utilsPaths = getComponentsPaths("", {
    utilsFile: pageSettings.appRoutesDirectory,
  });
  const utilsFilePath = utilsPaths.utilsFile;

  const utilsFileContent = updateUtils(utilsFilePath, pageName, startPageRoute);
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
      const formattedRouteEntry = newRouteEntry.replace(
        /"([^"]+)"/g,
        (_, path) => {
          // Match both ":param" and "[param]" patterns
          const params = [...path.matchAll(/[:\[]([a-zA-Z]+)[\]]?/g)];
          if (params.length) {
            const paramNames = params.map((match) => match[1]);
            const paramDefinitions = paramNames
              .map((param: string) => `${param}: string`)
              .join(", ");
            return `(${paramDefinitions}) => \`${path.replace(
              /[:\[]([a-zA-Z]+)[\]]?/g,
              (_: string, param: string) => `\${${param}}`
            )}\``;
          }
          // ✅ No params: just return plain string
          return `"${path}"`;
        }
      );
      return `${APP_ROUTES_DECLARATION}${
        trimmedRoutes
          ? `\n  ${trimmedRoutes}${
              trimmedRoutes.endsWith(",") ? "" : ","
            }\n  ${formattedRouteEntry}`
          : `\n  ${formattedRouteEntry}`
      }\n};`;
    }
  );
};
