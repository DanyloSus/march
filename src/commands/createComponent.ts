import { STYLES_TEMPLATE } from "../constants/index.js";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  getComponentsPaths,
  getTemplateContentWithName,
  writeFile,
} from "../helpers/index.js";

export function createComponent(
  componentName: string,
  options: { module?: string }
) {
  const moduleName = capitalizeComponentName(options.module);
  const formattedName = capitalizeComponentName(componentName);
  const componentFilePaths = getComponentsPaths(
    moduleName
      ? `src/modules/${moduleName}/components/${formattedName}`
      : `src/components/${formattedName}`,
    {
      component: "index.tsx",
      styles: "styles.ts",
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(componentFilePaths.baseDir);

  // Template for the component
  const componentTemplate = getTemplateContentWithName(
    "component",
    formattedName.split("/").pop()!
  );

  // Write files
  writeFile(componentFilePaths.component, componentTemplate);
  writeFile(componentFilePaths.styles, STYLES_TEMPLATE);
}
