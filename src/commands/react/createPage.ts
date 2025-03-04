import { PagesInterface } from "../../constants/types.js";
import {
  askForRoute,
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  ensureNameSuffix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  uncapitalizeFirstLetter,
  writeFile,
} from "../../helpers/index.js";
import { connectPage } from "../../helpers/react/createPageHelpers.js";

export async function createPage(
  pagePath: string,
  pagePathWithoutSuffix: string,
  options: { route?: string }
) {
  const pageSettings = getProjectSettingsOrDefault("pages") as PagesInterface;

  if (pageSettings.alwaysAskPageRoute && !options.route) {
    options.route = await askForRoute();
  }

  const capitalizedPageName = pagePath.split("/").pop() ?? "";
  const uncapitalizedPageName = uncapitalizeFirstLetter(capitalizedPageName);

  const paths = getComponentsPaths(
    `${pageSettings.baseDirectory}/${pagePath}`,
    {
      pageFile: `index.tsx`,
    }
  );

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
    templateName: "reactPage.tsx",
    capitalizeName: capitalizedPageName,
    uncapitalizeName: uncapitalizedPageName,
    path: pagePathWithoutSuffix,
    module: moduleMainImport,
  });

  // Write files
  writeFile(paths.pageFile, pageTemplate);

  if (options.route) {
    connectPage(capitalizedPageName, options.route, pagePath);
  }
}
