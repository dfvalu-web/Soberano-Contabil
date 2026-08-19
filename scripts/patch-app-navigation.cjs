const fs = require("fs");

let app = fs.readFileSync("packages/web/src/App.tsx", "utf8");

// 1. Add imports at the top
const importInsertion = `import { SidebarNavigation } from './components/SidebarNavigation';\nimport { DEPARTMENT_CATEGORIES as CATEGORIES, getModuleById, ALL_MODULES } from './config/navigation-modules';\n`;
if (!app.includes("SidebarNavigation")) {
  app = importInsertion + app;
}

// 2. Remove the old CATEGORIES array definition (from "export interface ModuleItem" to "];\n\nexport const App: React.FC")
const catStart = app.indexOf("export interface ModuleItem");
const catEnd = app.indexOf("];\n\nexport const App: React.FC");

if (catStart !== -1 && catEnd !== -1) {
  const replacement = `// Navigation categories and types imported from ./config/navigation-modules\n`;
  app = app.substring(0, catStart) + replacement + app.substring(catEnd + 3);
}

// 3. Replace the sidebar aside markup in App.tsx
const sidebarStart = app.indexOf('<aside className={`app-sidebar-left ${isSidebarOpen ? \'\' : \'collapsed\'}`}>');
const sidebarEnd = app.indexOf('</aside>\n\n        {/* ======================================================================= */}');

if (sidebarStart !== -1 && sidebarEnd !== -1) {
  const sidebarReplacement = `<SidebarNavigation\n          currentModuleId={currentModuleId}\n          onSelectModule={setCurrentModuleId}\n          className={isSidebarOpen ? '' : 'collapsed'}\n        />`;
  app = app.substring(0, sidebarStart) + sidebarReplacement + app.substring(sidebarEnd + 8);
}

fs.writeFileSync("packages/web/src/App.tsx", app, "utf8");
console.log("Successfully patched App.tsx, new size:", app.length);
