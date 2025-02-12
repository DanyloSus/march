import { join, resolve } from "path";
import {
  capitalizeComponentName,
  createDirectoryIfNotExists,
  writeFile,
} from "../helpers";

export function createIcon(iconName: string) {
  const capitalizedIconName = `${capitalizeComponentName(iconName)}Icon`;
  const baseDir = resolve(
    process.cwd(),
    `src/components/icons/${capitalizedIconName}`
  );
  const iconFilePath = join(baseDir, `${capitalizedIconName}.tsx`);

  // Create necessary directories
  createDirectoryIfNotExists(baseDir);

  // Template for the icon component
  const iconTemplate = `
import { FC } from "react";

import { SvgIcon } from "ui/SvgIcon";

import { SvgIconProps } from "types/styles";

export const ${capitalizedIconName}: FC<SvgIconProps> = (props) => (
  <SvgIcon
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    
  </SvgIcon>
);
  `;

  // Write file
  writeFile(iconFilePath, iconTemplate);
}
