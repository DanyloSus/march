import {
  capitalizeComponentPath,
  capitalizeFirstLetter,
  createDirectoryIfNotExists,
  getComponentsPaths,
  getTemplateContentWithName,
  uncapitalizeFirstLetter,
  writeFile,
} from "../helpers/index.js";
import { createComponent } from "./createComponent.js";

export function createModule(
  moduleName: string,
  options: { full?: boolean; startComponent?: string }
) {
  const modulePath = capitalizeComponentPath(moduleName);
  const capitalizedModuleName = capitalizeFirstLetter(
    moduleName.split("/").pop()
  );
  const uncapitalizedModuleName = uncapitalizeFirstLetter(
    moduleName.split("/").pop()
  );
  const startComponent = options.startComponent
    ? capitalizeComponentPath(options.startComponent)
    : capitalizedModuleName;

  const paths = getComponentsPaths(`src/modules/${modulePath}`, {
    mainModule: "index.ts",
    api: "api",
    apiFile: `api/${uncapitalizedModuleName}Api.ts`,
    constants: "constants",
    constantFile: "constants/index.ts",
    hooks: "hooks",
    store: "store",
    helpers: "helpers",
  });

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  // Templates for the files
  const apiTemplate = getTemplateContentWithName(
    "api.ts",
    uncapitalizedModuleName
  );
  const constantsTemplate = getTemplateContentWithName(
    "constants.ts",
    capitalizedModuleName
  );
  const mainImportTemplate = getTemplateContentWithName(
    "mainImport.ts",
    startComponent
  );

  if (options?.full) {
    createDirectoryIfNotExists(paths.api);
    createDirectoryIfNotExists(paths.constants);
    createDirectoryIfNotExists(paths.hooks);
    createDirectoryIfNotExists(paths.store);
    createDirectoryIfNotExists(paths.helpers);

    writeFile(paths.apiFile, apiTemplate);
    writeFile(paths.constantFile, constantsTemplate);
  }
  writeFile(paths.mainModule, mainImportTemplate);

  createComponent(startComponent, { module: modulePath });
}
