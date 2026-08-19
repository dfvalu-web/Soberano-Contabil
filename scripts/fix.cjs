const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Fix unquoted classNames
  content = content.replace(/className=\s*btn-primary-action/g, 'className="btn-primary-action"');
  content = content.replace(/className="\s*btn-primary-action\\>/g, 'className="btn-primary-action">');
  // Fix unquoted option values
  content = content.replace(/<option value=\s*ALL>/g, '<option value="ALL">');
  content = content.replace(/<option value=\s*SIMPLES_NACIONAL>/g, '<option value="SIMPLES_NACIONAL">');
  content = content.replace(/<option value=\s*LUCRO_PRESUMIDO>/g, '<option value="LUCRO_PRESUMIDO">');
  content = content.replace(/<option value=\s*LUCRO_REAL>/g, '<option value="LUCRO_REAL">');
  // Fix XML raw literal
  content = content.replace(/const sampleXml = <\?xml version=.*?\?>;/g, "const sampleXml = '<nfeProc versao=\"4.00\"><NFe><infNFe Id=\"NFe35260812345678000195550010000123451000123456\"><emit><xNome>DISTRIBUIDORA FARMACEUTICA</xNome></emit></infNFe></NFe></nfeProc>';");
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed:', file);
}

const files = [
  'packages/web/src/views/OfficeMultiClientClosingGridView.tsx',
  'packages/web/src/views/OfficeUniversalDropzoneOcrView.tsx',
  'packages/web/src/views/OfficeAnnualClosingAreView.tsx',
  'packages/web/src/views/PayrollOperationalView.tsx',
  'packages/web/src/views/OfficeLaborTerminationTrctView.tsx',
  'packages/web/src/views/OfficeAccountingIfrsLedgerView.tsx',
  'packages/web/src/views/OfficeMonophasicTaxSegregationView.tsx',
  'packages/web/src/views/OfficeBatchDispatchBundleView.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) fixFile(f);
});