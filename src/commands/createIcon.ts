import { IconsInterface } from "../constants/types.js";
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

export function createIcon(iconName: string) {
  const iconSettings = getProjectSettingsOrDefault("icons") as IconsInterface;

  const formattedPath = ensureNameSuffix(
    capitalizeComponentPath(iconName, iconSettings.capitalizePathAndName),
    iconSettings.suffix,
    iconSettings.addSuffix
  );

  const capitalizeName = formattedPath.split("/").pop() ?? "";
  const uncapitalizeName = uncapitalizeFirstLetter(capitalizeName);

  const iconFilePaths = getComponentsPaths(
    `${iconSettings.baseDirectory}/${formattedPath}`,
    {
      icon: `${capitalizeName}.tsx`,
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(iconFilePaths.baseDir);

  // Template for the icon component
  const iconTemplate = getTemplateContentWithName({
    templateName: "icon.tsx",
    capitalizeName: capitalizeName,
    uncapitalizeName: uncapitalizeName,
    path: formattedPath,
  });

  // Write file
  writeFile(iconFilePaths.icon, iconTemplate);
}
