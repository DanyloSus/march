#!/usr/bin/env node

import { program } from "commander";
import { createComponent } from "./commands/createComponent.js";
import { createIcon } from "./commands/createIcon.js";
import { createModule } from "./commands/createModule.js";
import { createPage } from "./commands/createPage.js";
import { cloneRepo } from "./commands/createProject.js";

program
  .version("1.0.0")
  .description("March script to create files, folders, and React components");

program
  .command("components <componentName>")
  .alias("c")
  .description("Create a new React functional component")
  .option(
    "-m, --module <moduleName>",
    "Specify the module to create the component in"
  )
  .action((componentName, options) => {
    createComponent(componentName, options);
  });

program
  .command("pages <pageName>")
  .alias("p")
  .description("Create a new React page")
  .option("-p, --path <path>", "Specify the path for the page")
  .action((pageName, options) => {
    createPage(pageName, options);
  });

program
  .command("modules <moduleName>")
  .alias("m")
  .description("Create a new module with a page and components")
  .option(
    "-f, --full",
    "Create a full module without api, constants, hooks, store, and helpers"
  )
  .option(
    "-sc, --start-component <startComponent>",
    "Specify the start component for the module"
  )
  .action((moduleName, options) => {
    createModule(moduleName, options);
  });

program
  .command("create-project <projectName>")
  .alias("cp")
  .description("Clone a Git repository from a URL")
  .action(cloneRepo);

program
  .command("icons <iconName>")
  .alias("i")
  .description("Create a new icon component")
  .action((iconName) => {
    createIcon(iconName);
  });

program.parse(process.argv);
