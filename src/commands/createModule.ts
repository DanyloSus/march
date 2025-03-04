import { ModulesInterface } from "../constants/types.js";
import {
  capitalizeComponentPath,
  checkMissingSettings,
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

  checkMissingSettings(moduleSettings, "modules");

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
    ? capitalizeComponentPath(
        options.startComponent,
        moduleSettings.capitalizePathAndName
      )
    : capitalizedModuleName;
  const uncapitalizedStartComponent = uncapitalizeFirstLetter(startComponent);

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
        capitalizeName: startComponent,
        uncapitalizeName: uncapitalizedModuleName,
        path: elementPath,
        module: startComponent.split("/").pop(),
      });

      writeFile(elementPath, templateContent);
    } else {
      createDirectoryIfNotExists(elementPath);
    }
  });

  if (moduleSettings.createMainImport) {
    const mainImportTemplate = getTemplateContentWithName({
      templateName: "mainImport.ts",
      capitalizeName: startComponent,
      uncapitalizeName: uncapitalizedStartComponent,
      path: modulePath,
      module: startComponent.split("/").pop(),
    });

    writeFile(paths.mainModule, mainImportTemplate);
  }

  if (moduleSettings.createStartComponent)
    createComponent(startComponent, { module: modulePath });
}
