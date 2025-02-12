import { join, resolve } from "path";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  writeFile,
} from "../helpers";
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

  const paths = {
    moduleDir: resolve(process.cwd(), "src/modules"),
    moduleDirFolderPath: join(
      resolve(process.cwd(), "src/modules"),
      modulePath
    ),
    mainModuleFilePath: join(
      resolve(process.cwd(), "src/modules", modulePath),
      "index.ts"
    ),
    apiFolderPath: join(
      resolve(process.cwd(), "src/modules", modulePath, "api")
    ),
    apiFilePath: join(
      resolve(process.cwd(), "src/modules", modulePath, "api"),
      `${module.charAt(0).toLowerCase() + module.slice(1)}Api.ts`
    ),
    constantsFolderPath: join(
      resolve(process.cwd(), "src/modules", modulePath, "constants")
    ),
    constantsFilePath: join(
      resolve(process.cwd(), "src/modules", modulePath, "constants"),
      "index.ts"
    ),
    hooksFolderPath: join(
      resolve(process.cwd(), "src/modules", modulePath, "hooks")
    ),
    storeFolderPath: join(
      resolve(process.cwd(), "src/modules", modulePath, "store")
    ),
    helpersFolderPath: join(
      resolve(process.cwd(), "src/modules", modulePath, "helpers")
    ),
  };

  createDirectoryIfNotExists(paths.moduleDir);
  createDirectoryIfNotExists(paths.moduleDirFolderPath);

  const templates = {
    apiTemplate: `
import api from "api/axios";

const ${module.charAt(0).toLowerCase() + module.slice(1)}Api = {
// write your api
};

export default ${module.charAt(0).toLowerCase() + module.slice(1)}Api;
    `,

    constantsTemplate: `
export const DUMMY_DATA = "dummy data";
    `,

    mainImportTemplate: `
export { ${startComponent} } from "./components/${startComponent}";
    `,
  };

  if (options?.full) {
    createDirectoryIfNotExists(paths.apiFolderPath);
    createDirectoryIfNotExists(paths.constantsFolderPath);
    createDirectoryIfNotExists(paths.hooksFolderPath);
    createDirectoryIfNotExists(paths.storeFolderPath);
    createDirectoryIfNotExists(paths.helpersFolderPath);

    writeFile(paths.apiFilePath, templates.apiTemplate);
    writeFile(paths.constantsFilePath, templates.constantsTemplate);
  }
  writeFile(paths.mainModuleFilePath, templates.mainImportTemplate);

  createComponent(startComponent, { module: modulePath });
}
