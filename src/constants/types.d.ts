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

export interface ModuleElement {
  elementPath: string;
  elementTemplate?: string;
}

export interface ModulesInterface extends DefaultConfigCreation {
  alwaysCreateFullModules: boolean;

  defaultElements: { [key: string]: ModuleElement };
  elementsOnFullCreation: { [key: string]: ModuleElement };

  createMainImport: boolean;
  createStartComponent: boolean;
}

export interface MarchConfig {
  type: ProjectType;
  icons: IconsInterface;
  components: ComponentsInterface;
  modules: ModulesInterface;
  pages: Record<string, string>;
}
