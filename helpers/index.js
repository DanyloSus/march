import chalk from "chalk";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export function createDirectoryIfNotExists(directoryPath) {
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
    console.log(chalk.blue(`Directory created: ${directoryPath}`));
  }
}

export function writeFile(filePath, content) {
  writeFileSync(filePath, content.trim(), "utf8");
  console.log(chalk.green(`File created: ${filePath}`));
}
