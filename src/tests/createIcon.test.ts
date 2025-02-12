const { createIcon } = require("../commands/createIcon");
const {
  createDirectoryIfNotExists,
  writeFile,
  capitalizeComponentName,
} = require("../helpers/index");

jest.mock("../helpers/index", () => ({
  createDirectoryIfNotExists: jest.fn(),
  writeFile: jest.fn(),
  capitalizeComponentName: jest.fn(
    (str) => str.charAt(0).toUpperCase() + str.slice(1)
  ),
}));

describe("createIcon", () => {
  it("should create a directory and write a file with the correct template", () => {
    const iconName = "testIcon";
    createIcon(iconName);

    const capitalizedIconName = "TestIconIcon";
    const baseDir = `/home/danylo/march-script/src/components/icons/${capitalizedIconName}`;
    const expectedFilePath = `${baseDir}/${capitalizedIconName}.tsx`;

    expect(createDirectoryIfNotExists).toHaveBeenCalledWith(baseDir);

    const expectedTemplate = `import { FC } from "react";
import { SvgIcon } from "ui/SvgIcon";
import { SvgIconProps } from "types/styles";

export const TestIconIcon: FC<SvgIconProps> = (props) => (
  <SvgIcon
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >    
  </SvgIcon>
);`;

    // Normalize both expected and actual strings for comparison
    const normalizeString = (str: string) =>
      str.trim().replace(/\s+/g, " ").replace(/\n\s*/g, "\n");

    expect(normalizeString(writeFile.mock.calls[0][1])).toBe(
      normalizeString(expectedTemplate)
    );
  });
});
