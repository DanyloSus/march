import {
  API_TEMPLATE,
  CONSTANTS_TEMPLATE,
  MAIN_IMPORT_TEMPLATE,
} from "../constants/index.js";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  getComponentsPaths,
  writeFile,
} from "../helpers/index.js";
import { createComponent } from "./createComponent.js";

export function createModule(
  moduleName: string,
  options: { full?: boolean; startComponent?: string }
) {
  const modulePath = moduleName
    .split("/")
    .map(capitalizeComponentName)
    .join("/");
  const module = capitalizeComponentName(moduleName.split("/").pop());
  const startComponent = options.startComponent
    ? capitalizeComponentName(options.startComponent)
    : module;

  const paths = getComponentsPaths(`src/modules/${modulePath}`, {
    mainModule: "index.ts",
    api: "api",
    apiFile: `api/${module.charAt(0).toLowerCase() + module.slice(1)}Api.ts`,
    constants: "constants",
    constantFile: "constants/index.ts",
    hooks: "hooks",
    store: "store",
    helpers: "helpers",
  });

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  // Templates for the files
  const apiTemplate = API_TEMPLATE(module);
  const constantsTemplate = CONSTANTS_TEMPLATE;
  const mainImportTemplate = MAIN_IMPORT_TEMPLATE(startComponent);

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
