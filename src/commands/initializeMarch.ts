import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  INDEX_FILE,
  MARCH_FOLDER,
  TEMPLATES_FOLDER,
} from "../constants/index.js";

export function initializeMarch() {
  const packageJsonPath = path.resolve("package.json");

  if (!existsSync(packageJsonPath)) {
    console.error(
      "Error: package.json not found. Run this in a Node.js project."
    );
    process.exit(1);
  }

  // Read package.json to determine project type
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const isNext = packageJson.dependencies?.next !== undefined;
  const projectType = isNext ? "next" : "react";

  // Create .march folder if not exists
  if (!existsSync(MARCH_FOLDER)) {
    mkdirSync(MARCH_FOLDER);
  }

  // Create index.json with project type
  const indexData = { type: projectType };
  writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2), "utf-8");

  // Create templates folder
  if (!existsSync(TEMPLATES_FOLDER)) {
    mkdirSync(TEMPLATES_FOLDER);
  }

  console.log(`✅ .march initialized with project type: ${projectType}`);
}
