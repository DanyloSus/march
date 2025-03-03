import chalk from "chalk";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import path, { join, resolve } from "path";
import { initializeMarch } from "../commands/initializeMarch.js";
import { MARCH_CONFIG, TEMPLATES } from "../constants/index.js";
import { MarchConfig } from "../constants/types.js";

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

export function capitalizeFirstLetter(
  string: string = "",
  doesCapitalize: boolean = true
) {
  return doesCapitalize
    ? string.charAt(0).toUpperCase() + string.slice(1)
    : string;
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

export function uncapitalizeFirstLetter(
  componentName: string = "",
  doesUncapitalize: boolean = true
) {
  return doesUncapitalize
    ? componentName.charAt(0).toLowerCase() + componentName.slice(1)
    : componentName;
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

export function getTemplateContentWithName({
  templateName,
  capitalizeName,
  uncapitalizeName = "",
  path = "",
}: {
  templateName: keyof typeof TEMPLATES;
  capitalizeName: string;
  uncapitalizeName?: string;
  path?: string;
}) {
  const templatePath = resolve(
    process.cwd(),
    `.march/templates/${templateName}`
  );

  if (existsSync(templatePath)) {
    return stripTsNocheck(
      readFileSync(templatePath, "utf-8")
        .replace(/NAME/g, capitalizeName)
        .replace(/name/g, uncapitalizeName)
        .replace(/PATH/g, path)
    );
  } else {
    const template = TEMPLATES[templateName];

    if (template) {
      return stripTsNocheck(template(capitalizeName, path));
    } else {
      console.log(
        chalk.red(`Template .march/templates/${templateName} not found`)
      );

      return "";
    }
  }
}

export const getCustomTemplateContent = ({
  templateName,
  capitalizeName,
  uncapitalizeName = "",
  path = "",
}: {
  templateName: string;
  capitalizeName: string;
  uncapitalizeName?: string;
  path?: string;
}) => {
  const templatePath = resolve(
    process.cwd(),
    `.march/templates/${templateName}`
  );

  if (existsSync(templatePath)) {
    return stripTsNocheck(
      readFileSync(templatePath, "utf-8")
        .replace(/NAME/g, capitalizeName)
        .replace(/name/g, uncapitalizeName)
        .replace(/PATH/g, path)
    );
  } else {
    console.log(
      chalk.red(`Template .march/templates/${templateName} not found`)
    );

    return "";
  }
};

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

export function ensureNamePrefix(
  name: string,
  prefix: string,
  doesAddPrefix: boolean = true
) {
  return !name.startsWith(prefix) && doesAddPrefix ? `${prefix}${name}` : name;
}

export function ensurePathSuffixes(
  path: string,
  suffix: string,
  doesAddSuffix: boolean = true
) {
  return doesAddSuffix
    ? path
        .split("/")
        .map((pathElement) => ensureNameSuffix(pathElement, suffix))
        .join("/")
    : path;
}

export async function askForRoute(): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "route",
      message: "Enter the page route (e.g., /dashboard):",
      validate: (input) =>
        input.trim() !== "" ? true : "Route cannot be empty",
    },
  ]);

  return answers.route;
}

export function deepMerge<T>(
  source: T,
  target: Partial<T>,
  ignoreKeys: string[] = []
): T {
  if (typeof source !== "object" || source === null) return source;

  const result: any = Array.isArray(source) ? [...source] : { ...source };

  for (const key in source) {
    if (ignoreKeys.includes(key)) {
      result[key] = target[key] ?? source[key];
    } else if (target[key] && typeof target[key] === "object") {
      result[key] = deepMerge(source[key], target[key], ignoreKeys);
    } else if (target[key] !== undefined) {
      result[key] = target[key];
    }
  }

  return result;
}

export function checkMissingSettings(
  settings: MarchConfig[keyof MarchConfig],
  settingsKey: keyof MarchConfig
) {
  // Check for missing settings
  const requiredSettings = Object.keys(MARCH_CONFIG[settingsKey]);

  const missingSettings = requiredSettings.filter(
    (setting) => settings[setting as keyof typeof settings] === undefined
  );

  if (missingSettings.length > 0) {
    console.log(
      chalk.red(
        `Missing icon settings: ${missingSettings.join(
          ", "
        )}\nRewrite in console march init again`
      )
    );

    process.exit(1);
  }
}

export function addTsNocheck(content: string): string {
  return `// @ts-nocheck\n${content}`;
}

export function stripTsNocheck(content: string): string {
  return content.replace(/\/\/ @ts-nocheck\s*\n/, "");
}
