import inquirer from "inquirer";
import {
  capitalizeComponentPath,
  capitalizeFirstLetter,
  createDirectoryIfNotExists,
  getComponentsPaths,
  getTemplateContentWithName,
  writeFile,
} from "../../helpers/index.js";
import { connectPage } from "../../helpers/next/createPageHelpers.js";
import { createModule } from "../createModule.js";

async function askForRoute(): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "route",
      message: "Enter the page route (e.g., /dashboard):",
      validate: (input) =>
        input.trim() !== "" ? true : "Route cannot be empty",
    },
  ]);

  return answers.route;
}

export async function createPage(
  pageName: string,
  options: { route?: string }
) {
  if (!options.route) {
    options.route = await askForRoute();
  }

  const route = options.route.startsWith("/")
    ? options.route
    : `/${options.route}`;

  const pagePath = capitalizeComponentPath(pageName);
  const page = capitalizeFirstLetter(pageName.split("/").pop());

  const paths = getComponentsPaths(`src/pages/${route}`, {
    pageFile: `index.tsx`,
  });

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  // Templates for the files
  const pageTemplate = getTemplateContentWithName(
    "nextPage.tsx",
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
