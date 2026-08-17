const fs = require('fs');

let dfeCode = fs.readFileSync('packages/web/src/views/DfeAuditView.tsx', 'utf8');

const targetCall = `  // Anomaly detector test item
  const anomalyRes = detectFiscalAnomalies(
    mockCompany,
    [
      {
        numeroItem: 1,
        codigoProduto: 'PROD-01',
        descricao: 'Bebida Energética Lata 250ml',
        ncm: '22021000', // Monofásico
        cfop: '5102',
        unidade: 'UN',
        quantidade: 100,
        valorUnitario: 8,
        valorTotal: 800,
        icms: { cst: '00', baseCalculo: 800, aliquota: 0, valor: 0 },
        pis: { cst: '01', baseCalculo: 800, aliquota: 1.65, valor: 13.20 }, // Anomalia: Monofásico tributado indevidamente
        cofins: { cst: '01', baseCalculo: 800, aliquota: 7.60, valor: 60.80 }
      }
    ],
    '5102'
  );`;

const replacementCall = `  // Anomaly detector test item
  const anomalyRes = detectFiscalAnomalies([
    {
      ncm: '22021000', // Monofásico
      cfop: '5102',
      cstIcms: '00',
      cstPisCofins: '01',
      aliqIcms: 0,
      aliqPis: 1.65,
      aliqCofins: 7.60,
      valorOperacao: 800
    }
  ]);`;

if (dfeCode.includes('detectFiscalAnomalies(\n    mockCompany,')) {
  dfeCode = dfeCode.replace(targetCall, replacementCall);
  fs.writeFileSync('packages/web/src/views/DfeAuditView.tsx', dfeCode, 'utf8');
  console.log('Fixed detectFiscalAnomalies call in DfeAuditView.tsx');
} else {
  console.log('Target call not directly matched, trying regex replace');
  dfeCode = dfeCode.replace(/const anomalyRes = detectFiscalAnomalies\([\s\S]*?'5102'\s*\);/, replacementCall);
  fs.writeFileSync('packages/web/src/views/DfeAuditView.tsx', dfeCode, 'utf8');
  console.log('Applied regex fix for detectFiscalAnomalies in DfeAuditView.tsx');
}
