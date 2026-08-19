import { Result, Ok, Err } from '../types/result.js';

export interface MonophasicTaxInput {
  empresaCnpj: string;
  razaoSocial: string;
  ramoAtividade: 'FARMACIA_DROGARIA' | 'AUTOPECAS' | 'BEBIDAS_FRIAS' | 'POSTO_COMBUSTIVEIS';
  faturamentoBrutoTotalBrl: number;
  receitaItensMonofasicosBrl: number;
  aliquotaEfetivaDasPercent: number; // Ex: 4.5% no Anexo I
}

export interface MonophasicTaxResult {
  empresaCnpj: string;
  razaoSocial: string;
  faturamentoBrutoTotalBrl: number;
  receitaItensMonofasicosBrl: number;
  receitaItensTributacaoNormalBrl: number;
  percentualDescontoPisCofinsDasPercent: number; // ~15.5% da alíquota do DAS
  valorDasSemSegregacaoBrl: number;
  valorDasComSegregacaoCorretaBrl: number;
  economiaTributariaMensalDasBrl: number;
  statusSegregacao: 'PRODUTOS_MONOFASICOS_SEGREGADOS_COM_SUCESSO';
  diagnosticoMonofasico: string;
}

export function processOfficeMonophasicTaxSegregationEngine(input: MonophasicTaxInput): Result<MonophasicTaxResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    ramoAtividade,
    faturamentoBrutoTotalBrl,
    receitaItensMonofasicosBrl,
    aliquotaEfetivaDasPercent
  } = input;

  if (!empresaCnpj || faturamentoBrutoTotalBrl <= 0 || receitaItensMonofasicosBrl < 0) {
    return Err(new Error('CNPJ, faturamento total e receita de itens monofásicos são obrigatórios.'));
  }

  const receitaNormal = Math.max(0, faturamentoBrutoTotalBrl - receitaItensMonofasicosBrl);

  // No Simples Nacional Anexo I, PIS e COFINS representam aproximadamente 15.5% da alíquota do DAS (PIS ~2.76% e COFINS ~12.74% da partilha)
  const pesoPisCofinsNaPartilhaPercent = 15.5;
  const aliquotaMonofasicaReduzidaPercent = aliquotaEfetivaDasPercent * (1 - (pesoPisCofinsNaPartilhaPercent / 100));

  // DAS sem segregação (pagando PIS/COFINS em duplicidade sobre tudo)
  const dasSemSegregacao = (faturamentoBrutoTotalBrl * aliquotaEfetivaDasPercent) / 100;

  // DAS com segregação correta no PGDAS-D
  const dasParteNormal = (receitaNormal * aliquotaEfetivaDasPercent) / 100;
  const dasParteMonofasica = (receitaItensMonofasicosBrl * aliquotaMonofasicaReduzidaPercent) / 100;
  const dasComSegregacao = dasParteNormal + dasParteMonofasica;

  const economia = Math.max(0, dasSemSegregacao - dasComSegregacao);

  const diag = "Segregação Monofásica (" + razaoSocial + " - " + ramoAtividade + "): Total: R$ " + faturamentoBrutoTotalBrl.toFixed(2) + " | Monofásicos: R$ " + receitaItensMonofasicosBrl.toFixed(2) + " | DAS Normal: R$ " + dasSemSegregacao.toFixed(2) + " | DAS Segregado: R$ " + dasComSegregacao.toFixed(2) + " | Economia Mensal: R$ " + economia.toFixed(2) + " (Zero bitributação Lei 10.147/00).";

  return Ok({
    empresaCnpj,
    razaoSocial,
    faturamentoBrutoTotalBrl: parseFloat(faturamentoBrutoTotalBrl.toFixed(2)),
    receitaItensMonofasicosBrl: parseFloat(receitaItensMonofasicosBrl.toFixed(2)),
    receitaItensTributacaoNormalBrl: parseFloat(receitaNormal.toFixed(2)),
    percentualDescontoPisCofinsDasPercent: pesoPisCofinsNaPartilhaPercent,
    valorDasSemSegregacaoBrl: parseFloat(dasSemSegregacao.toFixed(2)),
    valorDasComSegregacaoCorretaBrl: parseFloat(dasComSegregacao.toFixed(2)),
    economiaTributariaMensalDasBrl: parseFloat(economia.toFixed(2)),
    statusSegregacao: 'PRODUTOS_MONOFASICOS_SEGREGADOS_COM_SUCESSO',
    diagnosticoMonofasico: diag
  });
}
