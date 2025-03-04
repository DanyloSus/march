#!/usr/bin/env node

import { createComponent } from "./commands/createComponent.js";
import { createIcon } from "./commands/createIcon.js";
import { createModule } from "./commands/createModule.js";
import { createPage } from "./commands/createPage.js";
import { cloneRepo } from "./commands/createProject.js";

import { program } from "commander";
import { initializeMarch } from "./commands/initializeMarch.js";

program
  .version("1.3.10")
  .description("March to easier work with Module ARCHitecture");

program
  .command("components <componentName>")
  .alias("c")
  .description("Create a new component with its styles")
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
  .description("Create a new page with its module and section")
  .option(
    "-r, --route <route>",
    "Specify the route for the page in Router.tsx and APP_ROUTES"
  )
  .action((pageName, options) => {
    createPage(pageName, options);
  });

program
  .command("modules <moduleName>")
  .alias("m")
  .description("Create a new module with a page and components")
  .option(
    "-f, --full",
    "Create a full module with api, constants, hooks, store, and helpers"
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
  .description("Create a project from a template")
  .action(cloneRepo);

program
  .command("icons <iconName>")
  .alias("i")
  .description("Create a new icon")
  .action((iconName) => {
    createIcon(iconName);
  });

program
  .command("init")
  .description("Initialize the .march folder with project settings")
  .action(initializeMarch);

program.parse(process.argv);
