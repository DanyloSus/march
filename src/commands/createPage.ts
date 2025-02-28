import { PagesInterface } from "../constants/types.js";
import {
  capitalizeComponentPath,
  checkMissingSettings,
  ensureNameSuffix,
  getProjectSettingsOrDefault,
  getProjectType,
} from "../helpers/index.js";
import { createModule } from "./createModule.js";
import { createPage as createNextPage } from "./next/createPage.js";
import { createPage as createReactPage } from "./react/createPage.js";

export async function createPage(
  pageName: string,
  options: { route?: string } = {}
) {
  const pageSettings = getProjectSettingsOrDefault("pages") as PagesInterface;

  checkMissingSettings(pageSettings, "pages");

  const projectType = getProjectType();

  const pagePath = ensureNameSuffix(
    capitalizeComponentPath(pageName, pageSettings.capitalizePathAndName),
    pageSettings.suffix,
    pageSettings.addSuffix
  );
  const capitalizedPageName = pagePath.split("/").pop() ?? "";

  switch (projectType) {
    case "react":
      await createReactPage(pageName, options);
      break;
    case "next":
      await createNextPage(pageName, options);
      break;
  }

  const pagePathWithoutSuffix = pagePath.replace(
    new RegExp(`${pageSettings.suffix}$`),
    ""
  );

  if (pageSettings.doesCreateTheModule) {
    createModule(pagePathWithoutSuffix, {
      full: pageSettings.doesCreateFullModule,
      startComponent: `${pagePathWithoutSuffix}${
        pageSettings.addModuleStartComponentSuffix
          ? pageSettings.moduleStartComponentSuffix
          : ""
      }`,
    });
  }
}
