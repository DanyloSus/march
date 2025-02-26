import { ModulesInterface } from "../constants/types.js";
import {
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  ensureNameSuffix,
  getComponentsPaths,
  getCustomTemplateContent,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  uncapitalizeFirstLetter,
  writeFile,
} from "../helpers/index.js";
import { createComponent } from "./createComponent.js";

export function createModule(
  moduleName: string,
  options: { full?: boolean; startComponent?: string }
) {
  const moduleSettings = getProjectSettingsOrDefault(
    "modules"
  ) as ModulesInterface;

  const modulePath = ensureNameSuffix(
    capitalizeComponentPath(moduleName, moduleSettings.capitalizePathAndName),
    moduleSettings.suffix,
    moduleSettings.addSuffix
  );
  const capitalizedModuleName = moduleName.split("/").pop() ?? "";
  const uncapitalizedModuleName = uncapitalizeFirstLetter(
    capitalizedModuleName
  );

  const startComponent = options.startComponent
    ? capitalizeComponentPath(options.startComponent)
    : capitalizedModuleName;

  const moduleElements =
    moduleSettings.alwaysCreateFullModules || options.full
      ? moduleSettings.elementsOnFullCreation
      : moduleSettings.defaultElements;

  const paths = getComponentsPaths(
    `${moduleSettings.baseDirectory}/${modulePath}`,
    {
      mainModule: `index.ts`,

      ...Object.keys(moduleElements).reduce((acc, element) => {
        acc[element] = moduleElements[element].elementPath
          .replace(/NAME/g, capitalizedModuleName)
          .replace(/name/g, uncapitalizedModuleName);
        return acc;
      }, {} as Record<string, string>),
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(paths.baseDir);

  Object.keys(moduleElements).forEach((element) => {
    const elementPath = paths[element];

    if (moduleElements[element].elementTemplate) {
      const templateContent = getCustomTemplateContent({
        templateName: moduleElements[element].elementTemplate,
        capitalizeName: capitalizedModuleName,
        uncapitalizeName: uncapitalizedModuleName,
        path: elementPath,
      });

      writeFile(elementPath, templateContent);
    } else {
      createDirectoryIfNotExists(elementPath);
    }
  });

  if (moduleSettings.createMainImport) {
    const mainImportTemplate = getTemplateContentWithName({
      templateName: "mainImport.ts",
      capitalizeName: capitalizedModuleName,
      uncapitalizeName: uncapitalizedModuleName,
      path: modulePath,
    });

    writeFile(paths.mainModule, mainImportTemplate);
  }

  if (moduleSettings.createStartComponent)
    createComponent(startComponent, { module: modulePath });
}
