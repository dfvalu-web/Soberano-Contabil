const fs = require('fs');

let code = fs.readFileSync('packages/core/src/accounting/consolidation/consolidation-engine.ts', 'utf8');
code = code.replace('isEquilibrado: Math.abs(totalAtivoConsolidado - (totalPassivoConsolidado + totalPatrimonioLiquidoConsolidado - somaPlIndividual)) < 0.05', 'isEquilibrado: Math.abs(totalAtivoConsolidado - (totalPassivoConsolidado + totalPatrimonioLiquidoConsolidado)) < 0.05');
fs.writeFileSync('packages/core/src/accounting/consolidation/consolidation-engine.ts', code, 'utf8');

console.log('Fixed isEquilibrado in consolidation engine.');
