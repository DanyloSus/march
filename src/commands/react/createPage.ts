import { PAGE_TEMPLATE } from "../../constants/index.js";
import {
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  getComponentsPaths,
  writeFile,
} from "../../helpers/index.js";
import { connectPage } from "../../helpers/react/createPageHelpers.js";
import { createModule } from "../createModule.js";

export function createPage(pageName: string, options: { route?: string }) {
  const pagePath = pageName.split("/").map(capitalizeComponentPath).join("/");
  const page = capitalizeComponentPath(pageName.split("/").pop());

  const paths = getComponentsPaths(`src/pages/${pagePath}Page`, {
    pageFile: `index.tsx`,
  });

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  // Templates for the files
  const pageTemplate = PAGE_TEMPLATE(page, pagePath);

  // Write files
  writeFile(paths.pageFile, pageTemplate);

  if (options.route) {
    connectPage(page, options.route, pagePath);
  }

  // Create the section component using createModule
  createModule(pagePath, { full: true, startComponent: `${page}Section` });
}
