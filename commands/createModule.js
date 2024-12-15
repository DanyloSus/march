import { join, resolve } from "path";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index.js";
import { createComponent } from "./createComponent.js";

export function createModule(moduleName, options) {
  const paths = {
    moduleDir: resolve(process.cwd(), "src/modules"),
    moduleDirFolderPath: join(
      resolve(process.cwd(), "src/modules"),
      moduleName
    ),
    mainModuleFilePath: join(
      resolve(process.cwd(), "src/modules", moduleName),
      "index.ts"
    ),
    apiFolderPath: join(
      resolve(process.cwd(), "src/modules", moduleName, "api")
    ),
    apiFilePath: join(
      resolve(process.cwd(), "src/modules", moduleName, "api"),
      `${moduleName.charAt(0).toLowerCase() + moduleName.slice(1)}Api.ts`
    ),
    constantsFolderPath: join(
      resolve(process.cwd(), "src/modules", moduleName, "constants")
    ),
    constantsFilePath: join(
      resolve(process.cwd(), "src/modules", moduleName, "constants"),
      "index.ts"
    ),
    hooksFolderPath: join(
      resolve(process.cwd(), "src/modules", moduleName, "hooks")
    ),
    storeFolderPath: join(
      resolve(process.cwd(), "src/modules", moduleName, "store")
    ),
    helpersFolderPath: join(
      resolve(process.cwd(), "src/modules", moduleName, "helpers")
    ),
  };

  createDirectoryIfNotExists(paths.moduleDir);
  createDirectoryIfNotExists(paths.moduleDirFolderPath);

  const templates = {
    apiTemplate: `
import api from "api/axios";

const ${moduleName.charAt(0).toLowerCase() + moduleName.slice(1)}Api = {
// write your api
};

export default ${moduleName.charAt(0).toLowerCase() + moduleName.slice(1)}Api;
    `,

    constantsTemplate: `
export const DUMMY_DATA = "dummy data";
    `,

    mainImportTemplate: `
export { ${moduleName}Section } from "./components/${moduleName}Section";
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

  createComponent(`${moduleName}Section`, { module: moduleName });
}
