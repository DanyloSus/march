import {
  capitalizeComponentPath,
  capitalizeFirstLetter,
  createDirectoryIfNotExists,
  getComponentsPaths,
  getTemplateContentWithName,
  writeFile,
} from "../../helpers/index.js";
import { connectPage } from "../../helpers/react/createPageHelpers.js";
import { createModule } from "../createModule.js";

export function createPage(pageName: string, options: { route?: string }) {
  const pagePath = capitalizeComponentPath(pageName);
  const page = capitalizeFirstLetter(pageName.split("/").pop());

  const paths = getComponentsPaths(`src/pages/${pagePath}Page`, {
    pageFile: `index.tsx`,
  });

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  // Templates for the files
  const pageTemplate = getTemplateContentWithName(
    "reactPage.tsx",
    page,
    pagePath
  );

  // Write files
  writeFile(paths.pageFile, pageTemplate);

  if (options.route) {
    connectPage(page, options.route, pagePath);
  }

  // Create the section component using createModule
  createModule(pagePath, { full: true, startComponent: `${page}Section` });
}
