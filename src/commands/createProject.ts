import chalk from "chalk";
import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import ora from "ora";
import { join } from "path";

const repoHTTPS =
  "https://dsu1@bitbucket.org/empat_tech/react_modular_architecture_template.git";

// Clone repository
export function cloneRepo(projectName: string) {
  console.log(chalk.blue(`Starting project setup for ${projectName}...`));

  const spinner = ora({
    text: "Cloning repository...",
    spinner: "dots",
  }).start();

  exec(`git clone ${repoHTTPS} ./${projectName}`, (error, stdout, stderr) => {
    if (error) {
      spinner.fail(chalk.red(`Error cloning repository: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(chalk.yellow(stderr));
    }
    spinner.succeed(chalk.green(`Repository cloned to ./${projectName}`));

    // Update package.json
    console.log(chalk.blue("Updating package.json..."));
    const packageJsonPath = join(process.cwd(), projectName, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    packageJson.name = projectName;
    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
    console.log(chalk.green(`Updated package.json name to ${projectName}`));

    console.log(
      chalk.blue(
        "Downloading dependencies and initializing a new Git repository..."
      )
    );
    const initSpinner = ora({
      text: "Setting up project...",
      spinner: "dots",
    }).start();

    // Initialize a new Git repository and install dependencies
    exec(
      `cd ./${projectName} && rm -rf .git && git init && npm install && march init`,
      (initError, initStdout, initStderr) => {
        if (initError) {
          initSpinner.fail(
            chalk.red(
              `Error initializing new Git repository: ${initError.message}`
            )
          );
          return;
        }
        if (initStderr) {
          console.error(chalk.yellow(initStderr));
        }
        initSpinner.succeed(
          chalk.green(
            `Initialized a new Git repository and installed dependencies in ./${projectName}`
          )
        );
      }
    );
  });
}
