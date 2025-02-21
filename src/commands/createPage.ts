import { capitalizeComponentName, getProjectType } from "../helpers/index.js";
import { createModule } from "./createModule.js";
import { createPage as createNextPage } from "./next/createPage.js";
import { createPage as createReactPage } from "./react/createPage.js";

export async function createPage(
  pageName: string,
  options: { route?: string } = {}
) {
  const projectType = getProjectType();

  switch (projectType) {
    case "react":
      createReactPage(pageName, options);
      break;
    case "next":
      await createNextPage(pageName, options);
      break;
  }

  const pagePath = pageName.split("/").map(capitalizeComponentName).join("/");
  const page = capitalizeComponentName(pageName.split("/").pop());

  createModule(pagePath, { full: true, startComponent: `${page}Section` });
}
