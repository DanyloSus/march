# March Script

March Script is a command-line tool designed to help you work with a modular architecture in your React projects. It provides commands to create components, pages, modules, and icons, making it easier to maintain a consistent structure across your project.

## Installation

To use the March Script, install globally package:

`npm i -g march-script`

## Usage

March Script provides several commands to help you create components, pages, modules, and icons. Below are the available commands and their usage:

### Create Component

Create a new component with its styles.

`march components <componentName> [options]`

**Alias:** c

#### Options:

`-m, --module <moduleName>`: Specify the module to create the component in.

Example:

`march c Button -m ui`

### Create Page

Create a new page with its module and section.

`march pages <pageName> [options]`

**Alias:** p

#### Options:

`-p, --path <path>`: Specify the path for the page in Router.tsx and APP_ROUTES.

Example:

`march p HomePage -p /home`

### Create Module

Create a new module with a page and components.

`march modules <moduleName> [options]`

**Alias:** m

#### Options:

-f, --full: Create a full module with API, constants, hooks, store, and helpers.

-sc, --start-component <startComponent>: Specify the start component for the module.

Example:

`march m User -f -sc UserProfile`

### Create Project

Create a project from a template.

`march create-project <projectName>`

**Alias:** cp

Example:

`march cp my-new-project`

### Create Icon

Create a new icon component.

`march icons <iconName>`

**Alias:** i

Example:

`march icons Home`
