const fs = require('fs');

const b64 = Buffer.from(`import { Result, Ok, Err } from '../../types/result.js';

export interface CryptoOperationInput {
  operacaoId: string;
  mesAnoCompetencia: string; // Ex: '2026-03'
  simboloCripto: 'BTC' | 'ETH' | 'USDT' | 'SOL' | 'RWA_TOKEN';
  valorAlienacaoTotalMesBrl: number;
  custoAquisicaoTotalBrl: number;
}

export interface CryptoOperationResult {
  operacaoId: string;
  mesCompetencia: string;
  simbolo: string;
  totalAlienadoMesBrl: number;
  ganhoDeCapitalApuradoBrl: number;
  isentoAlienacaoAte35k: boolean;
  aliquotaGanhoCapitalPercent: number;
  impostoDeRendaDevidoBrl: number;
  layoutIn1888Txt: string;
  diagnosticoIn1888: string;
}

export function calculateCryptoTaxationIn1888(input: CryptoOperationInput): Result<CryptoOperationResult, Error> {
  const { operacaoId, mesAnoCompetencia, simboloCripto, valorAlienacaoTotalMesBrl, custoAquisicaoTotalBrl } = input;

  if (valorAlienacaoTotalMesBrl <= 0) {
    return Err(new Error('Valor de alienação de criptoativos deve ser superior a zero.'));
  }

  const ganhoCapital = Number(Math.max(0, valorAlienacaoTotalMesBrl - custoAquisicaoTotalBrl).toFixed(2));
  const isento35k = valorAlienacaoTotalMesBrl <= 35000.00;

  let aliquota = 0;
  let irDevido = 0;

  if (!isento35k && ganhoCapital > 0) {
    // Tabela progressiva de Ganho de Capital: 15% até 5M
    aliquota = 15.0;
    if (ganhoCapital > 5000000 && ganhoCapital <= 10000000) aliquota = 17.5;
    else if (ganhoCapital > 10000000 && ganhoCapital <= 30000000) aliquota = 20.0;
    else if (ganhoCapital > 30000000) aliquota = 22.5;

    irDevido = Number((ganhoCapital * (aliquota / 100)).toFixed(2));
  }

  const linhas = [
    'IN1888|' + mesAnoCompetencia + '|' + operacaoId + '|' + simboloCripto + '|ALIENACAO|' + valorAlienacaoTotalMesBrl.toFixed(2) + '|' + custoAquisicaoTotalBrl.toFixed(2) + '|' + ganhoCapital.toFixed(2) + '|' + (isento35k ? 'ISENTO' : 'TRIBUTAVEL') + '|' + irDevido.toFixed(2)
  ];

  const diag = 'IN RFB nº 1.888/2019: Operação em ' + simboloCripto + ' no mês ' + mesAnoCompetencia + '. Total alienado de R$ ' + valorAlienacaoTotalMesBrl.toFixed(2) + ' e ganho de capital de R$ ' + ganhoCapital.toFixed(2) + '. ' + (isento35k ? 'ISENTO de IRPF (Vendas no mês <= R$ 35.000,00).' : 'TRIBUTÁVEL: IRRF de R$ ' + irDevido.toFixed(2) + ' à alíquota de ' + aliquota + '%.');

  return Ok({
    operacaoId,
    mesCompetencia: mesAnoCompetencia,
    simbolo: simboloCripto,
    totalAlienadoMesBrl: valorAlienacaoTotalMesBrl,
    ganhoDeCapitalApuradoBrl: ganhoCapital,
    isentoAlienacaoAte35k: isento35k,
    aliquotaGanhoCapitalPercent: aliquota,
    impostoDeRendaDevidoBrl: irDevido,
    layoutIn1888Txt: linhas.join(String.fromCharCode(10)),
    diagnosticoIn1888: diag
  });
}
`, 'utf8').toString('base64');

fs.writeFileSync('packages/core/src/tax/special-sectors/crypto-assets-tax-in1888.ts', Buffer.from(b64, 'base64').toString('utf8'), 'utf8');
console.log('Cleaned crypto-assets-tax-in1888.ts.');
