export type ProjectType = "react" | "next";

export interface DefaultConfigCreation {
  baseDirectory: string;
  suffix: string;
  addSuffix: boolean;
  capitalizePathAndName: boolean;
}

export interface IconsInterface extends DefaultConfigCreation {}

export interface ComponentsInterface extends DefaultConfigCreation {
  doesCreateStyles: boolean;
  stylesFileName: string;
}

export interface MarchConfig {
  type: ProjectType;
  icons: IconsInterface;
  components: ComponentsInterface;
  modules: Record<string, string>;
  pages: Record<string, string>;
}
