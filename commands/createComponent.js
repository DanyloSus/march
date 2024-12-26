import { dirname, join, resolve } from "path";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index.js";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeComponentName(componentName) {
  return componentName.split("/").map(capitalizeFirstLetter).join("/");
}

export function createComponent(componentName, options) {
  const moduleName = capitalizeComponentName(options.module);
  const capitalizedComponentName = capitalizeComponentName(componentName);
  const baseDir = moduleName
    ? resolve(process.cwd(), "src/modules", moduleName, "components")
    : resolve(process.cwd(), "src/components");
  const componentFolderPath = join(
    baseDir,
    dirname(`${capitalizedComponentName}/index`)
  );
  const componentFilePath = join(
    baseDir,
    capitalizedComponentName,
    "index.tsx"
  );
  const stylesFilePath = join(baseDir, capitalizedComponentName, "styles.ts");

  // Create necessary directories
  createDirectoryIfNotExists(baseDir);
  createDirectoryIfNotExists(componentFolderPath);

  // Templates for the files
  const componentTemplate = `
import { FC } from "react";

import { Box } from "ui/Box";

import { styles } from "./styles";

interface ${capitalizedComponentName.split("/").pop()}Props {
    // Add your props here
}

export const ${capitalizedComponentName
    .split("/")
    .pop()}: FC<${capitalizedComponentName.split("/").pop()}Props> = () => {
    return (
        <Box sx={styles.root}>
          Dummy component
        </Box>
    );
};
  `;

  const stylesTemplate = `
import { SxStyles } from "types/styles";

export const styles: SxStyles = {
    root: { },
};
  `;

  // Write files
  writeFile(componentFilePath, componentTemplate);
  writeFile(stylesFilePath, stylesTemplate);
}
