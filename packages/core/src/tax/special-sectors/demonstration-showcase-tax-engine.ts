import { Result, Ok, Err } from '../../types/result.js';

export type DemoShowcaseType = 'REMESSA_DEMONSTRACAO' | 'REMESSA_MOSTRUARIO';

export interface DemoShowcaseInput {
  remessaId: string;
  tipoRemessa: DemoShowcaseType;
  clienteDestinatarioNome: string;
  valorMercadoriasBrl: number;
  diasDecorridosDesdeRemessa: number;
  retornoEfetivado: boolean;
  aliquotaIcmsPercent: number; // Ex: 18%
}

export interface DemoShowcaseResult {
  remessaId: string;
  tipoRemessa: DemoShowcaseType;
  cfopUtilizado: string;
  prazoLimiteLegalDias: number;
  prazoExpirado: boolean;
  icmsSuspensoIsentoBrl: number;
  icmsExigivelRetroativoBrl: number;
  diagnosticoFiscal: string;
}

export function processDemonstrationShowcaseTaxEngine(input: DemoShowcaseInput): Result<DemoShowcaseResult, Error> {
  const {
    remessaId,
    tipoRemessa,
    clienteDestinatarioNome,
    valorMercadoriasBrl,
    diasDecorridosDesdeRemessa,
    retornoEfetivado,
    aliquotaIcmsPercent
  } = input;

  if (valorMercadoriasBrl <= 0) {
    return Err(new Error('Valor das mercadorias para demonstração/mostruário deve ser superior a zero.'));
  }

  const icmsCalculado = Number((valorMercadoriasBrl * (aliquotaIcmsPercent / 100)).toFixed(2));

  if (tipoRemessa === 'REMESSA_DEMONSTRACAO') {
    // Prazo legal de 60 dias (Ajuste SINIEF 08/2008 & Art. 319 RICMS) - CFOP 5.912 / 6.912
    const prazoLimite = 60;
    const expirado = diasDecorridosDesdeRemessa > prazoLimite && !retornoEfetivado;
    const icmsDevido = expirado ? icmsCalculado : 0;

    const diag = 'Remessa para Demonstração (CFOP 5.912): Destinatário ' + clienteDestinatarioNome + '. Valor: R$ ' + valorMercadoriasBrl.toFixed(2) + '. Suspensão de ICMS (R$ ' + icmsCalculado.toFixed(2) + ') condicionada ao retorno em até 60 dias (' + diasDecorridosDesdeRemessa + ' dias decorridos). ' + (expirado ? 'ALERTA: Prazo de 60 dias expirado sem retorno. ICMS retroativo exigível com encargos moratórios.' : 'Operação regular dentro do prazo de suspensão.');

    return Ok({
      remessaId,
      tipoRemessa,
      cfopUtilizado: '5.912',
      prazoLimiteLegalDias: prazoLimite,
      prazoExpirado: expirado,
      icmsSuspensoIsentoBrl: icmsCalculado,
      icmsExigivelRetroativoBrl: icmsDevido,
      diagnosticoFiscal: diag
    });
  } else {
    // Mostruário: Prazo legal de 90 dias (Ajuste SINIEF 08/2008) - CFOP 5.915 / 6.915
    const prazoLimite = 90;
    const expirado = diasDecorridosDesdeRemessa > prazoLimite && !retornoEfetivado;
    const icmsDevido = expirado ? icmsCalculado : 0;

    const diag = 'Remessa para Mostruário (CFOP 5.915): Destinatário ' + clienteDestinatarioNome + '. Isenção/Suspensão de ICMS (R$ ' + icmsCalculado.toFixed(2) + ') com retorno em até 90 dias (' + diasDecorridosDesdeRemessa + ' dias decorridos). ' + (expirado ? 'ALERTA: Prazo de 90 dias expirado. ICMS exigível.' : 'Operação regular.');

    return Ok({
      remessaId,
      tipoRemessa,
      cfopUtilizado: '5.915',
      prazoLimiteLegalDias: prazoLimite,
      prazoExpirado: expirado,
      icmsSuspensoIsentoBrl: icmsCalculado,
      icmsExigivelRetroativoBrl: icmsDevido,
      diagnosticoFiscal: diag
    });
  }
}
