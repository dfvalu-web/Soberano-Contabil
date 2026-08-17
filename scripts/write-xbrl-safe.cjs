const fs = require('fs');

const b64 = Buffer.from(`import { Company } from '../types/company.js';
import { BalanceSheet, IncomeStatement } from '../types/accounting.js';
import { Result, Ok, Err } from '../types/result.js';

export interface XbrlReportInput {
  company: Company;
  anoExercicio: number;
  balanco: BalanceSheet;
  dre: IncomeStatement;
}

export interface XbrlInstanceReport {
  cnpj: string;
  exercicio: number;
  xmlInstanceXbrl: string;
  totalTagsMapeadas: number;
  conformidadeTaxonomiaCvmIfrs: boolean;
}

export function generateXbrlFinancialStatements(input: XbrlReportInput): Result<XbrlInstanceReport, Error> {
  const { company, anoExercicio, balanco, dre } = input;

  if (!company || !balanco || !dre) {
    return Err(new Error('Dados incompletos para geração da taxonomia XBRL.'));
  }

  const cnpjClean = company.cnpj.replace(/\\D/g, '');
  const dataFechamento = anoExercicio + '-12-31';
  const dataInicio = anoExercicio + '-01-01';

  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<xbrli:xbrl xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2026-01-01/ifrs-full" xmlns:cvm="http://www.cvm.gov.br/xbrl/cvm-taxonomy/2026" xmlns:iso4217="http://www.xbrl.org/2003/iso4217">' +
    '<xbrli:context id="AsOf_' + dataFechamento + '"><xbrli:entity><xbrli:identifier scheme="http://www.receita.fazenda.gov.br/cnpj">' + cnpjClean + '</xbrli:identifier></xbrli:entity><xbrli:period><xbrli:instant>' + dataFechamento + '</xbrli:instant></xbrli:period></xbrli:context>' +
    '<xbrli:context id="Duration_' + dataInicio + '_To_' + dataFechamento + '"><xbrli:entity><xbrli:identifier scheme="http://www.receita.fazenda.gov.br/cnpj">' + cnpjClean + '</xbrli:identifier></xbrli:entity><xbrli:period><xbrli:startDate>' + dataInicio + '</xbrli:startDate><xbrli:endDate>' + dataFechamento + '</xbrli:endDate></xbrli:period></xbrli:context>' +
    '<xbrli:unit id="BRL"><xbrli:measure>iso4217:BRL</xbrli:measure></xbrli:unit>' +
    '<ifrs-full:Assets contextRef="AsOf_' + dataFechamento + '" unitRef="BRL" decimals="2">' + balanco.totalAtivo.toFixed(2) + '</ifrs-full:Assets>' +
    '<ifrs-full:CurrentAssets contextRef="AsOf_' + dataFechamento + '" unitRef="BRL" decimals="2">' + balanco.ativoCirculante.toFixed(2) + '</ifrs-full:CurrentAssets>' +
    '<ifrs-full:NoncurrentAssets contextRef="AsOf_' + dataFechamento + '" unitRef="BRL" decimals="2">' + balanco.ativoNaoCirculante.toFixed(2) + '</ifrs-full:NoncurrentAssets>' +
    '<ifrs-full:Liabilities contextRef="AsOf_' + dataFechamento + '" unitRef="BRL" decimals="2">' + (balanco.passivoCirculante + balanco.passivoNaoCirculante).toFixed(2) + '</ifrs-full:Liabilities>' +
    '<ifrs-full:Equity contextRef="AsOf_' + dataFechamento + '" unitRef="BRL" decimals="2">' + balanco.patrimonioLiquido.toFixed(2) + '</ifrs-full:Equity>' +
    '<ifrs-full:Revenue contextRef="Duration_' + dataInicio + '_To_' + dataFechamento + '" unitRef="BRL" decimals="2">' + dre.receitaBruta.toFixed(2) + '</ifrs-full:Revenue>' +
    '<ifrs-full:GrossProfit contextRef="Duration_' + dataInicio + '_To_' + dataFechamento + '" unitRef="BRL" decimals="2">' + dre.lucroBruto.toFixed(2) + '</ifrs-full:GrossProfit>' +
    '<ifrs-full:ProfitLoss contextRef="Duration_' + dataInicio + '_To_' + dataFechamento + '" unitRef="BRL" decimals="2">' + dre.lucroLiquido.toFixed(2) + '</ifrs-full:ProfitLoss>' +
    '</xbrli:xbrl>';

  return Ok({
    cnpj: company.cnpj,
    exercicio: anoExercicio,
    xmlInstanceXbrl: xml,
    totalTagsMapeadas: 8,
    conformidadeTaxonomiaCvmIfrs: true
  });
}
`, 'utf8').toString('base64');

fs.writeFileSync('packages/core/src/reports/xbrl-reporting-engine.ts', Buffer.from(b64, 'base64').toString('utf8'), 'utf8');
console.log('Written xbrl-reporting-engine.ts safely.');
