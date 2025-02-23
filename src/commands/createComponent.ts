import {
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  getComponentsPaths,
  getTemplateContentWithName,
  writeFile,
} from "../helpers/index.js";

export function createComponent(
  componentName: string,
  options: { module?: string }
) {
  const moduleName = capitalizeComponentPath(options.module);
  const formattedName = capitalizeComponentPath(componentName);
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
    "component.tsx",
    formattedName.split("/").pop()!
  );

  const componentStyleTemplate = getTemplateContentWithName(
    "componentStyle.ts",
    formattedName.split("/").pop()!
  );

  // Write files
  writeFile(componentFilePaths.component, componentTemplate);
  writeFile(componentFilePaths.styles, componentStyleTemplate);
}
