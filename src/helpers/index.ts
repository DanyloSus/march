import chalk from "chalk";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { initializeMarch } from "../commands/initializeMarch.js";

export function getProjectType(): "react" | "next" {
  const configPath = path.resolve(".march/index.json");

  if (!existsSync(configPath)) {
    initializeMarch();
  }

  const config = JSON.parse(readFileSync(configPath, "utf-8"));
  return config.type === "next" ? "next" : "react";
}

export function createDirectoryIfNotExists(directoryPath: string) {
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
    console.log(chalk.blue(`Directory created: ${directoryPath}`));
  }
}

export function writeFile(filePath: string, content: string) {
  if (existsSync(filePath)) {
    writeFileSync(filePath, content.trim(), "utf8");
    console.log(chalk.gray(`File updated: ${filePath}`));
  } else {
    writeFileSync(filePath, content.trim(), "utf8");
    console.log(chalk.green(`File created: ${filePath}`));
  }
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

export function getComponentsPaths(
  modulePath: string,
  componentsNames: { [key: string]: string }
) {
  const baseDir = resolve(process.cwd(), modulePath);

  const paths = Object.keys(componentsNames).reduce((acc, componentName) => {
    acc[componentName] = join(baseDir, componentsNames[componentName]);
    return acc;
  }, {} as { [key: string]: string });

  paths["baseDir"] = baseDir;

  return paths;
}
