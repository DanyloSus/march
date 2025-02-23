export const ICON_TEMPLATE = (name: string) => {
  return `
import { FC } from "react";

import { SvgIcon } from "ui/SvgIcon";

import { SvgIconProps } from "types/styles";

export const ${name}Icon: FC<SvgIconProps> = (props) => (
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

const ${moduleName}Api = {
// write your api
};

export default ${moduleName}Api;
`;

export const CONSTANTS_TEMPLATE = `
export const DUMMY_DATA = "dummy data";
`;

export const MAIN_IMPORT_TEMPLATE = (startComponent: string) => `
export { ${startComponent} } from "./components/${startComponent}";
`;

export const NEXT_PAGE_TEMPLATE = (page: string, pagePath: string) => `
import { ${page}Section } from 'modules/${pagePath}';

export function getServerSideProps() {
  return {
    props: {},
  };
}

const ${page} = () => {
  return (
    <${page}Section />
  );
};

export default ${page};
    `;

export const PAGE_TEMPLATE = (page: string, pagePath: string) => `
import { FC } from "react";

import { ${page}Section } from "modules/${pagePath}";

interface ${page}PageProps {}

const ${page}Page: FC<${page}PageProps> = () => {
  return <${page}Section />;
};

export default ${page}Page;
    `;

export const TEMPLATES = {
  "icon.tsx": (name: string) => ICON_TEMPLATE(name),
  "component.tsx": (name: string) => COMPONENT_TEMPLATE(name),
  "componentStyle.ts": () => STYLE_TEMPLATE,
  "api.ts": (name: string) => API_TEMPLATE(name),
  "constants.ts": () => CONSTANTS_TEMPLATE,
  "mainImport.ts": (name: string) => MAIN_IMPORT_TEMPLATE(name),
};
