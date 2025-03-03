import { PagesInterface } from "../../constants/types.js";
import {
  askForRoute,
  capitalizeComponentPath,
  capitalizeFirstLetter,
  createDirectoryIfNotExists,
  ensureNamePrefix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  writeFile,
} from "../../helpers/index.js";
import { connectPage } from "../../helpers/next/createPageHelpers.js";

export async function createPage(
  pagePath: string,
  options: { route?: string }
) {
  const pageSettings = getProjectSettingsOrDefault("pages") as PagesInterface;

  if (!options.route) {
    options.route = await askForRoute();
  }

  const route = ensureNamePrefix(options.route, "/");

  const capitalizedPageName = capitalizeFirstLetter(pagePath.split("/").pop());
  const uncapitalizedPageName = capitalizeComponentPath(pagePath);

  const paths = getComponentsPaths(`${pageSettings.baseDirectory}/${route}`, {
    pageFile: `index.tsx`,
  });

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  // Templates for the files
  const pageTemplate = getTemplateContentWithName({
    templateName: "nextPage.tsx",
    capitalizeName: capitalizedPageName,
    uncapitalizeName: uncapitalizedPageName,
    path: pagePath,
  });

  // Write files
  writeFile(paths.pageFile, pageTemplate);

  connectPage(capitalizedPageName, route, pagePath);
}
