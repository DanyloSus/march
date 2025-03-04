# Changelog

## [1.3.3] - 2025-03-04

### Fixes

- Fix creating of function routes in `Routing.tsx`, by adding its params
- Add function routes for `Next`
- Fix creation of additional suffixes and incorrect modules while page creation

## [1.3.2] - 2025-03-04

### Fixes

- Fix creating of routes in `APP_ROUTES`, by removing params from function

## [1.3.1] - 2025-03-03

I forgot about building the package

## [1.3.0] - 2025-03-03

### Fixes

- Fix creating of icon component

### Features

- General:
    - Add settings in `index.json`
    - Add settings for React and Next projects
    - Add deep merge for already created configurations and templates
    - Add `no-check` for all templates
    - Add loading and march init for page creation
- Icon creation:
    - Add icon settings
- Component creation:
    - Add component settings
- Module creation:
    - Add module settings
- Page creation:
    - Add page settings

## [1.2.0] - 2025-02-23

### Features

- General:
    - Add initializing templates files and connect them for creation
- Icon creation:
    - Add templating for icons from `icon.tsx`
- Component creation:
    - Add templating for components from `component.tsx`
    - Add templating for components' styles from `componentStyle.ts`
- Module creation:
    - Add templating for apis from `api.ts`
    - Add templating for constants from `constants.ts`
    - Add templating for modules' main import from `mainImport.ts`
- Page creation:
    - Add templating for react pages from `reactPage.tsx`
    - Add templating for next pages from `nextPage.tsx`

## [1.1.1] - 2025-02-22

### Features

- General:
    - Add initializing march folder
- Page creation:
    - Add dependency from project type
    - Add creation pages for `Next`

## [1.1.0] - 2025-02-21

### Features

- General:
    - Rewrite all code on `TypeScript`
    - Add tests
    - Refactor the code
    - Change README
    - Add CHANGELOG
- Page creation:
    - Change path option on route

## [1.0.2] - 2025-01-02

### Fixes

- Fix capitalizing component names

## [1.0.1] - 2025-01-01

### Fixes

- Fix duplicates of pages in `src/Routing.ts`
- Fix installation point

### Features

- General:
    - Add createIcon command
    - Add README and descriptions
- Component creation:
    - Add capitalizing of component names
- Module creation:
    - Add capitalizing of component names
    - Add start component as option
    - Add nesting
- Page creation:
    - Add adding page's path in `APP_ROUTE` in `src/utils/index.ts`
    - Add adding page in `src/Routing.ts`
    - Add capitalizing of component names
    - Add nesting
- Project creation:
    - Add rewriting names

## [1.0.0] - 2024-12-15

First release 🎉
