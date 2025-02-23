import { ComponentsInterface } from "../constants/types.js";
import {
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  ensureNameSuffix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
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
  const formattedName = ensureNameSuffix(
    capitalizeComponentPath(
      componentName,
      componentSettings.capitalizePathAndName
    ),
    componentSettings.suffix,
    componentSettings.addSuffix
  );

  const componentFilePaths = getComponentsPaths(
    moduleName
      ? `src/modules/${moduleName}/components/${formattedName}`
      : `${componentSettings.baseDirectory}/${formattedName}`,
    {
      component: "index.tsx",
      styles: `${componentSettings.stylesFileName}.ts`,
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(componentFilePaths.baseDir);

  // Template for the component
  const componentTemplate = getTemplateContentWithName(
    "component.tsx",
    formattedName.split("/").pop()!
  );

  const componentStyleTemplate = getTemplateContentWithName(
    "componentStyle.ts",
    formattedName.split("/").pop()!
  );

  // Write files
  writeFile(componentFilePaths.component, componentTemplate);

  if (componentSettings.doesCreateStyles)
    writeFile(componentFilePaths.styles, componentStyleTemplate);
}
