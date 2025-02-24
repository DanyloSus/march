import { ComponentsInterface } from "../constants/types.js";
import {
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  ensureNameSuffix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  uncapitalizeFirstLetter,
  writeFile,
} from "../helpers/index.js";

export function createComponent(
  componentName: string,
  options: { module?: string }
) {
  const componentSettings = getProjectSettingsOrDefault(
    "components"
  ) as ComponentsInterface;

  const moduleName = capitalizeComponentPath(
    options.module,
    componentSettings.capitalizePathAndName
  );
  const formattedPath = ensureNameSuffix(
    capitalizeComponentPath(
      componentName,
      componentSettings.capitalizePathAndName
    ),
    componentSettings.suffix,
    componentSettings.addSuffix
  );

  const capitalizedName = formattedPath.split("/").pop() ?? "";
  const uncapitalizedName = uncapitalizeFirstLetter(capitalizedName);

  const componentFilePaths = getComponentsPaths(
    moduleName
      ? `src/modules/${moduleName}/components/${formattedPath}`
      : `${componentSettings.baseDirectory}/${formattedPath}`,
    {
      component: "index.tsx",
      styles: `${componentSettings.stylesFileName}.ts`,
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(componentFilePaths.baseDir);

  // Template for the component
  const componentTemplate = getTemplateContentWithName({
    templateName: "component.tsx",
    capitalizeName: capitalizedName,
    uncapitalizeName: uncapitalizedName,
    path: "",
  });

  const componentStyleTemplate = getTemplateContentWithName({
    templateName: "componentStyle.ts",
    capitalizeName: capitalizedName,
    uncapitalizeName: uncapitalizedName,
    path: "",
  });

  // Write files
  writeFile(componentFilePaths.component, componentTemplate);

  if (componentSettings.doesCreateStyles)
    writeFile(componentFilePaths.styles, componentStyleTemplate);
}
