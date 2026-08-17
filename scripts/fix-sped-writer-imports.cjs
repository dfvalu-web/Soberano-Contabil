const fs = require('fs');

const files = [
  'packages/core/src/sped/ecf/generator.ts',
  'packages/core/src/sped/efd-icms-ipi/generator.ts',
  'packages/core/src/sped/efd-contribuicoes/generator.ts'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/from '\.\.\/formatter.*'/g, "from '../formatter/sped-writer.js'");
  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed formatter import in: ' + f);
});

const spedIndex = `export * from './formatter/sped-writer.js';
export * from './ecd/generator.js';
export * from './ecf/generator.js';
export * from './efd-icms-ipi/generator.js';
export * from './efd-contribuicoes/generator.js';
export * from './validator/pva-validator.js';
`;
fs.writeFileSync('packages/core/src/sped/index.ts', spedIndex, 'utf8');
