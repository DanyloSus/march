import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { TEMPLATES } from "../constants/index.js";
import {
  createDirectoryIfNotExists,
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
    iconTemplate: "templates/icon.tsx",
    componentTemplate: "templates/component.tsx",
    componentStyleTemplate: "templates/componentStyle.tsx",
  });

  // Read package.json to determine project type
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const isNext = packageJson.dependencies?.next !== undefined;
  const projectType = isNext ? "next" : "react";

  if (!existsSync(paths.baseDir)) {
    createDirectoryIfNotExists(paths.baseDir);
  }

  const indexData = { type: projectType };
  writeFile(paths.index, JSON.stringify(indexData, null, 2));

  if (!existsSync(paths.templates)) {
    createDirectoryIfNotExists(paths.templates);
  }

  writeFile(paths.iconTemplate, TEMPLATES.icon("NAME"));
  writeFile(paths.componentTemplate, TEMPLATES.component("NAME"));
  writeFile(paths.componentStyleTemplate, TEMPLATES.componentStyle());

  console.log(
    chalk.green(`✅ .march initialized with project type: ${projectType}`)
  );
}
