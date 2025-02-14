import { ICON_TEMPLATE } from "../constants";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  getComponentsPaths,
  writeFile,
} from "../helpers";

export function createIcon(iconName: string) {
  const capitalizedIconName = `${capitalizeComponentName(iconName)}Icon`;
  const iconFilePaths = getComponentsPaths(
    `src/components/icons/${capitalizedIconName}`,
    {
      icon: `${capitalizedIconName}.tsx`,
    }
  );

  // Create necessary directories
  createDirectoryIfNotExists(iconFilePaths.baseDir);

  // Template for the icon component
  const iconTemplate = ICON_TEMPLATE(capitalizedIconName);

  // Write file
  writeFile(iconFilePaths.icon, iconTemplate);
}
