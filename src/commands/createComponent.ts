import { COMPONENT_TEMPLATE, STYLES_TEMPLATE } from "../constants/index.js";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  getComponentsPaths,
  writeFile,
} from "../helpers/index.js";

export function createComponent(
  componentName: string,
  options: { module?: string }
) {
  const moduleName = capitalizeComponentName(options.module);
  const capitalizedComponentName = capitalizeComponentName(componentName);
  const componentFilePaths = getComponentsPaths(
    moduleName
      ? `src/modules/${moduleName}/components/${capitalizedComponentName}`
      : `src/components/${capitalizedComponentName}`,
    {
      component: "index.tsx",
      styles: "styles.ts",
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(componentFilePaths.baseDir);

  // Template for the component
  const componentTemplate = COMPONENT_TEMPLATE(
    capitalizedComponentName.split("/").pop()!
  );

  // Write files
  writeFile(componentFilePaths.component, componentTemplate);
  writeFile(componentFilePaths.styles, STYLES_TEMPLATE);
}
