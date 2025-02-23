import { IconsType } from "../constants/types.js";
import {
  capitalizeComponentPath,
  createDirectoryIfNotExists,
  ensureNameSuffix,
  getComponentsPaths,
  getProjectSettingsOrDefault,
  getTemplateContentWithName,
  writeFile,
} from "../helpers/index.js";

export function createIcon(iconName: string) {
  const iconSettings = getProjectSettingsOrDefault("icons") as IconsType;

  let formattedName = ensureNameSuffix(
    capitalizeComponentPath(iconName),
    iconSettings.suffix,
    iconSettings.addSuffix
  );

  const iconFilePaths = getComponentsPaths(
    `${iconSettings.baseDirectory}/${formattedName}`,
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
