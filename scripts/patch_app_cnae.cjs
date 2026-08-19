const fs = require('fs');

let appContent = fs.readFileSync('packages/web/src/App.tsx', 'utf8');

// 1. Add CnaeSectorBanner import and officeStore import if missing
if (!appContent.includes('CnaeSectorBanner')) {
  appContent = `import { CnaeSectorBanner } from './components/CnaeSectorBanner.js';\nimport { officeStore } from './state/office-store.js';\n` + appContent;
}

// 2. Add tenant resolver
if (!appContent.includes('currentTenantObj')) {
  const targetState = `  const [selectedTenant, setSelectedTenant] = useState<string>('Soberano Tech S/A');`;
  const replacementState = `  const [selectedTenant, setSelectedTenant] = useState<string>('Soberano Tech S/A');
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const currentTenantObj = useMemo(() => {
    return tenants.find(t => t.name === selectedTenant || t.id === selectedTenant) || tenants[0];
  }, [tenants, selectedTenant]);`;
  appContent = appContent.replace(targetState, replacementState);
}

// 3. Pass tenant to SidebarNavigation
appContent = appContent.replace(
  `<SidebarNavigation\n          currentModuleId={currentModuleId}\n          onSelectModule={setCurrentModuleId}\n          className={isSidebarOpen ? '' : 'collapsed'}\n        />`,
  `<SidebarNavigation\n          currentModuleId={currentModuleId}\n          onSelectModule={setCurrentModuleId}\n          tenant={currentTenantObj}\n          className={isSidebarOpen ? '' : 'collapsed'}\n        />`
);

// 4. Add CnaeSectorBanner in the central workspace
if (!appContent.includes('<CnaeSectorBanner')) {
  const targetWorkspace = `<div className="view-card-container">`;
  const replacementWorkspace = `<CnaeSectorBanner tenant={currentTenantObj} onSelectModule={setCurrentModuleId} currentModuleId={currentModuleId} />\n          <div className="view-card-container">`;
  appContent = appContent.replace(targetWorkspace, replacementWorkspace);
}

fs.writeFileSync('packages/web/src/App.tsx', appContent, 'utf8');
console.log('App.tsx successfully patched with CNAE Sectorial Banner and Tenant matching!');