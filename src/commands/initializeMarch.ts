import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { MARCH_CONFIG, TEMPLATES } from "../constants/index.js";
import {
  createDirectoryIfNotExists,
  deepMerge,
  getComponentsPaths,
  writeFile,
} from "../helpers/index.js";

export function initializeMarch() {
  const packageJsonPath = path.resolve("package.json");

  if (!existsSync(packageJsonPath)) {
    console.error(
      "Error: package.json not found. Run this in a Node.js project."
    );
    process.exit(1);
  }

  const paths = getComponentsPaths(".march", {
    index: "index.json",
    templates: "templates",
  });

  // Read package.json to determine project type
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const isNext = packageJson.dependencies?.next !== undefined;
  const projectType = isNext ? "next" : "react";

  if (!existsSync(paths.baseDir)) {
    createDirectoryIfNotExists(paths.baseDir);
  }

  // Load existing config if it exists
  let existingConfig: Partial<typeof MARCH_CONFIG> = {};
  if (existsSync(paths.index)) {
    try {
      existingConfig = JSON.parse(readFileSync(paths.index, "utf-8"));
    } catch (error) {
      console.error(chalk.red("⚠️ Error reading index.json, using defaults."));
    }
  }

  // Merge configurations while ignoring specific fields
  const mergedConfig = deepMerge(MARCH_CONFIG, existingConfig, [
    "defaultElements",
    "elementsOnFullCreation",
  ]);

  // Override project type (React/Next.js)
  mergedConfig.type = projectType;

  if (projectType === "next" && !Object.keys(existingConfig).length) {
    mergedConfig.pages.suffix = "";
    mergedConfig.pages.addSuffix = false;
    mergedConfig.pages.routingDirectory = "";
    mergedConfig.pages.doesAddRouteToRouting = false;
  }

  writeFile(paths.index, JSON.stringify(mergedConfig, null, 2));

  if (!existsSync(paths.templates)) {
    createDirectoryIfNotExists(paths.templates);
  }

  // Create only necessary templates without overwriting existing ones
  Object.entries(TEMPLATES).forEach(([filename, templateFn]) => {
    const filePath = path.join(paths.templates, filename);

    // Determine if this template matches the project type or has no prefix
    const isGeneralTemplate =
      !filename.startsWith("react") && !filename.startsWith("next");
    const isCorrectProjectType = filename.startsWith(projectType);

    if ((isGeneralTemplate || isCorrectProjectType) && !existsSync(filePath)) {
      const content = templateFn("NAME", "PATH"); // Adjust parameters as needed
      writeFile(filePath, content);
    }
  });

  console.log(
    chalk.green(`✅ .march initialized with project type: ${projectType}`)
  );
}
