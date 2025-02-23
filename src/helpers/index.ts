import chalk from "chalk";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { initializeMarch } from "../commands/initializeMarch.js";
import { MARCH_CONFIG, TEMPLATES } from "../constants/index.js";

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

export function capitalizeFirstLetter(string: string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeComponentPath(
  componentName: string = "",
  doesCapitalize: boolean = true
) {
  return componentName
    .split("/")
    .map((name) => (doesCapitalize ? capitalizeFirstLetter(name) : name))
    .join("/");
}

export function uncapitalizeFirstLetter(componentName: string = "") {
  return componentName.charAt(0).toLowerCase() + componentName.slice(1);
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

export function getTemplateContentWithName(
  templateName: keyof typeof TEMPLATES,
  name: string,
  path: string = ""
) {
  const templatePath = resolve(
    process.cwd(),
    `.march/templates/${templateName}`
  );

  if (existsSync(templatePath)) {
    return readFileSync(templatePath, "utf-8")
      .replace(/NAME/g, name)
      .replace(/PATH/g, path);
  } else {
    const template = TEMPLATES[templateName];

    return template(name, path);
  }
}

export function getProjectSettingsOrDefault(
  settingObject: keyof typeof MARCH_CONFIG
) {
  const configPath = path.resolve(".march/index.json");

  if (!existsSync(configPath)) {
    initializeMarch();
  }

  const config: typeof MARCH_CONFIG = JSON.parse(
    readFileSync(configPath, "utf-8")
  );

  return config[settingObject];
}

export function ensureNameSuffix(
  name: string,
  suffix: string,
  doesAddSuffix: boolean = true
) {
  return !name.endsWith(suffix) && doesAddSuffix ? `${name}${suffix}` : name;
}
