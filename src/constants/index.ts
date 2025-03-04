import { MarchConfig } from "./types";

export const ICON_TEMPLATE = (name: string) => {
  return `
import { FC } from "react";

import { SvgIcon } from "ui/SvgIcon";

import { SvgIconProps } from "types/styles";

export const ${name}: FC<SvgIconProps> = (props) => (
  <SvgIcon
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    
  </SvgIcon>
);
`;
};

export const COMPONENT_TEMPLATE = (componentName: string) => `
import { FC } from "react";

import { Box } from "ui/Box";

import { styles } from "./styles";

interface ${componentName}Props {
    // Add your props here
}

export const ${componentName}: FC<${componentName}Props> = () => {
    return (
        <Box sx={styles.root}>
          Dummy component
        </Box>
    );
};
`;

export const STYLE_TEMPLATE = `
import { SxStyles } from "types/styles";

export const styles: SxStyles = {
    root: {},
};
`;

export const API_TEMPLATE = (moduleName: string) => `
import api from "api/axios";

const nameApi = {
// write your api
};

export default nameApi;
`;

export const CONSTANTS_TEMPLATE = `
export const DUMMY_DATA = "dummy data";
`;

export const MAIN_IMPORT_TEMPLATE = (startComponent: string) => `
export { MODULE } from "./components/MODULE";
`;

export const NEXT_PAGE_TEMPLATE = (page: string, pagePath: string) => `
import { MODULE } from 'modules/${pagePath}';

export function getServerSideProps() {
  return {
    props: {},
  };
}

const ${page} = () => {
  return (
    <MODULE />
  );
};

export default ${page};
    `;

export const PAGE_TEMPLATE = (page: string, pagePath: string) => `
import { FC } from "react";

import { MODULE } from "modules/${pagePath}";

interface ${page}Props {}

const ${page}: FC<${page}Props> = () => {
  return <MODULE />;
};

export default ${page};
    `;

export const TEMPLATES = {
  "icon.tsx": (name: string) => ICON_TEMPLATE(name),
  "component.tsx": (name: string) => COMPONENT_TEMPLATE(name),
  "componentStyle.ts": () => STYLE_TEMPLATE,
  "api.ts": (name: string) => API_TEMPLATE(name),
  "constants.ts": () => CONSTANTS_TEMPLATE,
  "mainImport.ts": (name: string) => MAIN_IMPORT_TEMPLATE(name),
  "reactPage.tsx": (page: string, pagePath: string) =>
    PAGE_TEMPLATE(page, pagePath),
  "nextPage.tsx": (page: string, pagePath: string) =>
    NEXT_PAGE_TEMPLATE(page, pagePath),
};

export const MARCH_CONFIG: MarchConfig = {
  type: "react",

  icons: {
    baseDirectory: "src/components/icons",
    suffix: "Icon",
    addSuffix: true,
    capitalizePathAndName: true,
  },

  components: {
    baseDirectory: "src/components",
    suffix: "",
    addSuffix: false,
    capitalizePathAndName: true,

    doesCreateStyles: true,
    stylesFileName: "styles",
  },

  modules: {
    baseDirectory: "src/modules",
    suffix: "",
    addSuffix: false,
    capitalizePathAndName: true,

    alwaysCreateFullModules: false,

    defaultElements: {},
    elementsOnFullCreation: {
      api: { elementPath: "api" },
      apiFile: {
        elementPath: `api/nameApi.ts`,
        elementTemplate: "api.ts",
      },
      constants: { elementPath: "constants" },
      constantFile: {
        elementPath: "constants/index.ts",
        elementTemplate: "constants.ts",
      },
      hooks: { elementPath: "hooks" },
      store: { elementPath: "store" },
      helpers: { elementPath: "helpers" },
    },

    createMainImport: true,
    createStartComponent: true,
  },

  pages: {
    baseDirectory: "src/pages",
    suffix: "Page",
    addSuffix: true,
    capitalizePathAndName: true,

    doesCreateTheModule: true,
    doesCreateFullModule: true,
    addModuleStartComponentSuffix: true,
    moduleStartComponentSuffix: "Section",

    alwaysAskPageRoute: false,
    appRoutesDirectory: "src/utils/index.ts",
    doesAddRouteToAppRoutes: true,
    routingDirectory: "src/Routing.tsx",
    doesAddRouteToRouting: true,

    hasPageStyles: false,
  },
};
