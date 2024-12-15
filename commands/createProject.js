import chalk from "chalk";
import { exec } from "child_process";

const repoHTTPS =
  "https://dsu1@bitbucket.org/empat_tech/react_modular_architecture_template.git";

// Clone repository
export function cloneRepo(projectName) {
  console.log(chalk.blue(`Cloning repository from ${repoHTTPS}...`));

  exec(`git clone ${repoHTTPS} ./${projectName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error cloning repository: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(chalk.yellow(stderr));
    }
    console.log(chalk.green(stdout));
    console.log(chalk.green(`Repository cloned to ./${projectName}`));

    // Initialize a new Git repository
    exec(
      `cd ./${projectName} && rm -rf .git && git init`,
      (initError, initStdout, initStderr) => {
        if (initError) {
          console.error(
            chalk.red(
              `Error initializing new Git repository: ${initError.message}`
            )
          );
          return;
        }
        if (initStderr) {
          console.error(chalk.yellow(initStderr));
        }
        console.log(chalk.green(initStdout));
        console.log(
          chalk.green(`Initialized a new Git repository in ./${projectName}`)
        );
      }
    );
  });
}
