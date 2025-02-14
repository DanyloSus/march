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
