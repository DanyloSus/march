import chalk from "chalk";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export function createDirectoryIfNotExists(directoryPath: string) {
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
    console.log(chalk.blue(`Directory created: ${directoryPath}`));
  }
}

export function writeFile(filePath: string, content: string) {
  writeFileSync(filePath, content.trim(), "utf8");
  console.log(chalk.green(`File created: ${filePath}`));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeComponentName(componentName?: string) {
  return (
    (componentName &&
      componentName.split("/").map(capitalizeFirstLetter).join("/")) ||
    ""
  );
}
