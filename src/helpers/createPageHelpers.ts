import { existsSync, readFileSync } from "fs";
import { getComponentsPaths, writeFile } from "./index.js";

export const updateUtils = (
  utilsFilePath: string,
  pageName: string,
  pagePath: string
) => {
  let utilsFileContent = existsSync(utilsFilePath)
    ? readFileSync(utilsFilePath, "utf8")
    : "";

  if (!utilsFileContent.includes("export const APP_ROUTES")) {
    utilsFileContent += `
export const APP_ROUTES = {};
            `;
  }

  if (
    !utilsFileContent.includes(
      `${pageName.charAt(0).toLowerCase() + pageName.slice(1)}: "${pagePath}"`
    )
  ) {
    utilsFileContent = utilsFileContent.replace(
      /export const APP_ROUTES = {([\s\S]*?)};/,
      (_, routes) => {
        return `export const APP_ROUTES = {
  ${routes.trim()}${
          routes.trim()[routes.trim().length - 1] === "," ||
          !routes.trim()[routes.trim().length - 1]
            ? ""
            : ","
        }${routes.trim() && "\n"}  ${
          pageName.charAt(0).toLowerCase() + pageName.slice(1)
        }: "${pagePath}"
};`;
      }
    );
  }
  return utilsFileContent;
};

// Update Routing.tsx
export const updateRouting = (
  utilsFilePath: string,
  routingFilePath: string,
  pageName: string,
  pageRoute: string,
  pagePath: string
) => {
  // get utils file content
  let utilsFileContent = existsSync(utilsFilePath)
    ? readFileSync(utilsFilePath, "utf8")
    : "";

  // get routing file content
  let routingFileContent = readFileSync(routingFilePath, "utf8");

  // Add import statement for APP_ROUTES if it doesn't exist
  if (!routingFileContent.includes("import { APP_ROUTES }")) {
    routingFileContent = `import { APP_ROUTES } from 'utils';\n${routingFileContent}`;
  }

  // Add import statement for LazyLoadPage
  const importStatement = `const ${pageName}Page = lazy(() => import('pages/${pagePath}Page'));\n`;
  // Add route statement with the path and element
  const routeStatement = `      <Route path={APP_ROUTES.${
    pageName.charAt(0).toLowerCase() + pageName.slice(1)
  }} element={<LazyLoadPage children={<${pageName}Page />} />} />\n`;

  // Add import statement for the page if it doesn't exist
  if (!routingFileContent.includes(`const ${pageName}Page`)) {
    routingFileContent = routingFileContent.replace(
      /(const Routing = \(\) => {\n)/,
      `${importStatement}\n$1`
    );
  }

  // Find all paths that have element and it is not LazyLoadPage
  const nonLazyLoadPaths = [];
  const routeRegex =
    /<Route path={APP_ROUTES\.([^}]+)} element={<([^>]+)>}>([\s\S]*?)<\/Route>/g;
  let match;
  while ((match = routeRegex.exec(routingFileContent)) !== null) {
    if (!match[2]?.includes("LazyLoadPage")) {
      nonLazyLoadPaths.push(match[1]);
    }
  }

  // Match the APP_ROUTES object in the utilsFileContent string using a regular expression
  const appRoutesMatchResult = utilsFileContent.match(
    /export const APP_ROUTES = {([\s\S]*?)};/
  );

  // If a match is found, split the matched content by new lines; otherwise, set appRoutesMatch to an empty array
  const appRoutesMatch = appRoutesMatchResult
    ? appRoutesMatchResult[1].split("\n")
    : [];

  // Initialize baseLayoutPath as undefined
  let baseLayoutPath: string | undefined;

  // Initialize an empty array to store layout paths
  const layoutsPaths: { [key: string]: string }[] = [];

  // Iterate over each path in nonLazyLoadPaths
  nonLazyLoadPaths.forEach((path) => {
    // Find the index of the route that includes the current path
    const pathOfThePaths = appRoutesMatch.findIndex((route) =>
      route.includes(`${path}:`)
    );

    // If a matching route is found
    if (pathOfThePaths) {
      // Extract the path value from the matched route using a regular expression
      const pathMatch = appRoutesMatch[pathOfThePaths].match(/"([^"]+)"/);
      const pathValue = pathMatch ? pathMatch[1] : "";

      // If the path value is "/", set baseLayoutPath to the current path
      if (pathValue === "/") {
        baseLayoutPath = path;
      } else {
        // Otherwise, add the path and its value to layoutsPaths
        layoutsPaths.push({ [path]: pathValue });
      }
    }
  });

  // Find the layout in layoutsPaths that matches the beginning of pageRoute
  const matchingLayout = layoutsPaths.find((layout) => {
    const layoutPathValue = Object.values(layout ?? {})[0];
    return pageRoute?.startsWith(layoutPathValue);
  });

  // Get the name of the matching layout
  const matchingLayoutName = Object.keys(matchingLayout ?? {})[0];

  // Create a regular expression to match the layout route in the routing file content
  const layoutRegex = new RegExp(
    matchingLayoutName || baseLayoutPath
      ? `(<Route path={APP_ROUTES.${
          matchingLayoutName || baseLayoutPath
        }} element={<[^>]+>}>\n)`
      : `(<Routes>\n)`
  );

  // If the routing file content does not already include the specified element
  if (
    !routingFileContent.includes(
      `element={<LazyLoadPage children={<${pageName}Page />} />}`
    )
  ) {
    // Replace the layout route in the routing file content with the new route statement
    routingFileContent = routingFileContent.replace(
      layoutRegex,
      `$1${matchingLayoutName || baseLayoutPath ? `  ` : ""}${routeStatement}`
    );
  }

  // Return the modified routing file content
  return routingFileContent;
};

export const connectPage = (
  pageName: string,
  startPageRoute: string,
  pagePath: string
) => {
  let pageRoute = startPageRoute.startsWith("/")
    ? startPageRoute
    : `/${startPageRoute}`;

  const utilsPaths = getComponentsPaths("src/utils", {
    utilsFile: "index.ts",
  });

  const utilsFilePath = utilsPaths.utilsFile;

  const utilsFileContent = updateUtils(utilsFilePath, pageName, pageRoute);

  writeFile(utilsFilePath, utilsFileContent);

  const routingPaths = getComponentsPaths("src/", {
    routingFile: "Routing.tsx",
  });

  const routingFilePath = routingPaths.routingFile;

  const routingFileContent = updateRouting(
    utilsFilePath,
    routingFilePath,
    pageName,
    pageRoute,
    pagePath
  );

  writeFile(routingFilePath, routingFileContent);
};
