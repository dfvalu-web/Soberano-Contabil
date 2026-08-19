import { Result, Ok, Err } from '../types/result.js';

export interface OmissionCorrectionInput {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  valorReceitaOmitidaBrl: number;
  aliquotaEfetivaTributacaoPercent: number; // Ex: 8.5%
}

export interface OmissionCorrectionResult {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: string;
  valorReceitaRegularizadaBrl: number;
  tributoPrincipalRegularizadoBrl: number;
  multaDeOficioEvitadaBrl: number; // Multa de 75% a 150% do Fisco
  statusRegularizacao: 'DENUNCIA_ESPONTANEA_CTN_138_REGULARIZADA';
  diagnosticoRegularizacao: string;
}

export function processOfficeDimpDecredDivergenceEngine(input: OmissionCorrectionInput): Result<OmissionCorrectionResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    regimeTributario,
    valorReceitaOmitidaBrl,
    aliquotaEfetivaTributacaoPercent
  } = input;

  if (!clienteCnpj || valorReceitaOmitidaBrl <= 0) {
    return Err(new Error('CNPJ e valor de receita positiva a regularizar são obrigatórios.'));
  }

  const tributoPrincipal = (valorReceitaOmitidaBrl * aliquotaEfetivaTributacaoPercent) / 100;
  const multaEvitada = tributoPrincipal * 0.75; // 75% de multa punitiva economizada pela retificação prévia

  const diag = "Retificação Preventiva CTN 138 (" + razaoSocial + " - " + regimeTributario + "): Receita regularizada: R$ " + valorReceitaOmitidaBrl.toLocaleString('pt-BR') + " | Tributo apurado: R$ " + tributoPrincipal.toLocaleString('pt-BR') + " | Economia de Multa Punitiva SEFAZ (75%): R$ " + multaEvitada.toLocaleString('pt-BR') + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    regimeTributario,
    valorReceitaRegularizadaBrl: valorReceitaOmitidaBrl,
    tributoPrincipalRegularizadoBrl: parseFloat(tributoPrincipal.toFixed(2)),
    multaDeOficioEvitadaBrl: parseFloat(multaEvitada.toFixed(2)),
    statusRegularizacao: 'DENUNCIA_ESPONTANEA_CTN_138_REGULARIZADA',
    diagnosticoRegularizacao: diag
  });
}
