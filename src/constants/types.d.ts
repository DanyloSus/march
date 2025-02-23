export type ProjectType = "react" | "next";

export type IconsType = {
  baseDirectory: string;
  suffix: string;
  addSuffix: boolean;
};

export interface MarchConfig {
  type: ProjectType;
  icons: IconsType;
  components: Record<string, string>;
  modules: Record<string, string>;
  pages: Record<string, string>;
}
