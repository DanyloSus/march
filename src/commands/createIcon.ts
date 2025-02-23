import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  ensureNameSuffix,
  getComponentsPaths,
  getTemplateContentWithName,
  writeFile,
} from "../helpers/index.js";

export function createIcon(iconName: string) {
  let formattedName = ensureNameSuffix(
    capitalizeComponentName(iconName),
    "Icon"
  );

  const iconFilePaths = getComponentsPaths(
    `src/components/icons/${formattedName}`,
    {
      icon: `${formattedName}.tsx`,
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(iconFilePaths.baseDir);

  // Template for the icon component
  const iconTemplate = getTemplateContentWithName("icon.tsx", formattedName);

  // Write file
  writeFile(iconFilePaths.icon, iconTemplate);
}
