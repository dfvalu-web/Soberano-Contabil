const fs = require('fs');
let app = fs.readFileSync('packages/web/src/App.tsx', 'utf8');
app = app.replace("import { PayrollView } from './views/PayrollView.js';", "import { PayrollOperationalView } from './views/PayrollOperationalView.js';");
app = app.replace("import { AccountingView } from './views/AccountingView.js';", "import { OfficeAccountingIfrsLedgerView } from './views/OfficeAccountingIfrsLedgerView.js';");
app = app.replace("<PayrollView />", "<PayrollOperationalView />");
app = app.replace("<AccountingView />", "<OfficeAccountingIfrsLedgerView />");
fs.writeFileSync('packages/web/src/App.tsx', app, 'utf8');
console.log('App.tsx patched successfully!');
