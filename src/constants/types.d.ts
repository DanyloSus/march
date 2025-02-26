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

export interface PagesInterface extends DefaultConfigCreation {
  routingDirectory: string;
  doesAddRouteToRouting: boolean;

  doesCreateTheModule: boolean;
  doesCreateFullModule: boolean;
  moduleStartComponentSuffix: string;
  addModuleStartComponentSuffix: boolean;

  alwaysAskPageRoute: boolean;
  appRoutesDirectory: string;
  doesAddRouteToAppRoutes: boolean;
}

export interface MarchConfig {
  type: ProjectType;
  icons: IconsInterface;
  components: ComponentsInterface;
  modules: ModulesInterface;
  pages: PagesInterface;
}
