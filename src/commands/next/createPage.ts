import { PagesInterface } from "../../constants/types.js";
import {
  askForRoute,
  capitalizeComponentPath,
  capitalizeFirstLetter,
  createDirectoryIfNotExists,
  ensureNamePrefix,
  ensureNameSuffix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  writeFile,
} from "../../helpers/index.js";
import { connectPage } from "../../helpers/next/createPageHelpers.js";

export async function createPage(
  pagePath: string,
  pagePathWithoutSuffix: string,
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

  const moduleMainImport = ensureNameSuffix(
    capitalizeComponentPath(
      pagePathWithoutSuffix,
      pageSettings.capitalizePathAndName
    ),
    pageSettings.moduleStartComponentSuffix,
    pageSettings.addModuleStartComponentSuffix
  );

  // Templates for the files
  const pageTemplate = getTemplateContentWithName({
    templateName: "nextPage.tsx",
    capitalizeName: capitalizedPageName,
    uncapitalizeName: uncapitalizedPageName,
    path: pagePathWithoutSuffix,
    module: moduleMainImport,
  });

  // Write files
  writeFile(paths.pageFile, pageTemplate);

  connectPage(capitalizedPageName, route, pagePath);
}
