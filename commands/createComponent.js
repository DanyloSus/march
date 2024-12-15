import { dirname, join, resolve } from "path";
import { createDirectoryIfNotExists, writeFile } from "../helpers/index.js";

export function createComponent(componentName, options) {
  const moduleName = options.module;
  const baseDir = moduleName
    ? resolve(process.cwd(), "src/modules", moduleName, "components")
    : resolve(process.cwd(), "src/components");
  const componentFolderPath = join(baseDir, dirname(`${componentName}/index`));
  const componentFilePath = join(baseDir, componentName, "index.tsx");
  const stylesFilePath = join(baseDir, componentName, "styles.ts");

  // Create necessary directories
  createDirectoryIfNotExists(baseDir);
  createDirectoryIfNotExists(componentFolderPath);

  // Templates for the files
  const componentTemplate = `
import { FC } from "react";

import { Box } from "ui/Box";

import { styles } from "./styles";

interface ${componentName.split("/").pop()}Props {
    // Add your props here
}

export const ${componentName.split("/").pop()}: FC<${componentName
    .split("/")
    .pop()}Props> = () => {
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
