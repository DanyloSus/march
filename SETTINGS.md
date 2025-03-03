# index.json

The `index.json` object is used to configure various aspects of the March Script tool. Below are the available options, their types, and explanations of what they change.

## type
- **Type:** `string`
- **Description:** Specifies the type of project. Currently, only "react" and "next" is supported.

## icons
- **Type:** `object`
- **Description:** Configuration for icon components.

  - **baseDirectory**
    - **Type:** `string`
    - **Description:** The base directory where icon components will be created.

  - **suffix**
    - **Type:** `string`
    - **Description:** The suffix to add to icon component names.

  - **addSuffix**
    - **Type:** `boolean`
    - **Description:** Whether to add the suffix to icon component names.

  - **capitalizePathAndName**
    - **Type:** `boolean`
    - **Description:** Whether to capitalize the path and name of icon components.

## components
- **Type:** `object`
- **Description:** Configuration for regular components.

  - **baseDirectory**
    - **Type:** `string`
    - **Description:** The base directory where components will be created.

  - **suffix**
    - **Type:** `string`
    - **Description:** The suffix to add to component names.

  - **addSuffix**
    - **Type:** `boolean`
    - **Description:** Whether to add the suffix to component names.

  - **capitalizePathAndName**
    - **Type:** `boolean`
    - **Description:** Whether to capitalize the path and name of components.

  - **doesCreateStyles**
    - **Type:** `boolean`
    - **Description:** Whether to create a styles file for the component.

  - **stylesFileName**
    - **Type:** `string`
    - **Description:** The name of the styles file to be created.

## modules
- **Type:** `object`
- **Description:** Configuration for modules.

  - **baseDirectory**
    - **Type:** `string`
    - **Description:** The base directory where modules will be created.

  - **suffix**
    - **Type:** `string`
    - **Description:** The suffix to add to module names.

  - **addSuffix**
    - **Type:** `boolean`
    - **Description:** Whether to add the suffix to module names.

  - **capitalizePathAndName**
    - **Type:** `boolean`
    - **Description:** Whether to capitalize the path and name of modules.

  - **alwaysCreateFullModules**
    - **Type:** `boolean`
    - **Description:** Whether to always create full modules with all elements.

  - **defaultElements**
    - **Type:** `array`
    - **Description:** The default elements to include in a module.

  - **elementsOnFullCreation**
    - **Type:** `array`
    - **Description:** The elements to include when creating a full module.

    - **elements** 
        - **Type** `object`
        - **Description** The element that will be created.

        - **elementPath**
            - **Type** `string`
            - **Description** The path that will be used for creation or folder or file
        
        - **elementTemplate**
            - **Type** `string`
            - **Description** The template that will be used for creation the file

  - **createMainImport**
    - **Type:** `boolean`
    - **Description:** Whether to create a main import file for the module.

  - **createStartComponent**
    - **Type:** `boolean`
    - **Description:** Whether to create a start component for the module.

## pages
- **Type:** `object`
- **Description:** Configuration for pages.

  - **baseDirectory**
    - **Type:** `string`
    - **Description:** The base directory where pages will be created.

  - **suffix**
    - **Type:** `string`
    - **Description:** The suffix to add to page names.

  - **addSuffix**
    - **Type:** `boolean`
    - **Description:** Whether to add the suffix to page names.

  - **capitalizePathAndName**
    - **Type:** `boolean`
    - **Description:** Whether to capitalize the path and name of pages.

  - **doesCreateTheModule**
    - **Type:** `boolean`
    - **Description:** Whether to create a module for the page.

  - **doesCreateFullModule**
    - **Type:** `boolean`
    - **Description:** Whether to create a full module for the page.

  - **addModuleStartComponentSuffix**
    - **Type:** `boolean`
    - **Description:** Whether to add a suffix to the start component of the module.

  - **moduleStartComponentSuffix**
    - **Type:** `string`
    - **Description:** The suffix to add to the start component of the module.

  - **alwaysAskPageRoute**
    - **Type:** `boolean`
    - **Description:** Whether to always ask for the page route.

  - **appRoutesDirectory**
    - **Type:** `string`
    - **Description:** The directory where the APP_ROUTES constant is located.

  - **doesAddRouteToAppRoutes**
    - **Type:** `boolean`
    - **Description:** Whether to add the route to the APP_ROUTES.

  - **routingDirectory**
    - **Type:** `string`
    - **Description:** The directory where the Routing file is located.

  - **doesAddRouteToRouting**
    - **Type:** `boolean`
    - **Description:** Whether to add the route to the Routing file.

  - **hasPageStyles**
    - **Type:** `boolean`
    - **Description:** Whether to create a styles file for the page.