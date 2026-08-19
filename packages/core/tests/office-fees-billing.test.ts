import { describe, it, expect } from 'vitest';
import {
  processOfficeFeesBillingEngine,
  processOfficeDunningCollectionEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Honorários Contábeis, NFS-e & Régua de Cobrança PIX', () => {
  it('1. Deve faturar honorarios recorrentes com adicionais de folha e 13o de honorarios', () => {
    const resBilling = processOfficeFeesBillingEngine({
      escritorioCnpj: '10.000.000/0001-00',
      mesCompetencia: '2026-08',
      contratosClientes: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocialCliente: 'Restaurante & Bar Central Ltda',
          honorarioBaseMensalBrl: 1500.00,
          quantidadeVidasFolha: 10,
          valorAdicionalPorVidaBrl: 35.00, // R$ 350,00
          volumeNotasFiscaisMes: 200,
          taxaExcedenteNotasBrl: 0.00,
          adicionalDecimoTerceiroHonorario: false
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocialCliente: 'Indústria Têxtil Brasil S/A',
          honorarioBaseMensalBrl: 4500.00,
          quantidadeVidasFolha: 50,
          valorAdicionalPorVidaBrl: 35.00, // R$ 1.750,00
          volumeNotasFiscaisMes: 1200,
          taxaExcedenteNotasBrl: 300.00, // R$ 300,00 excedente
          adicionalDecimoTerceiroHonorario: false
        }
      ]
    });

    const dataBilling = unwrap(resBilling);
    expect(dataBilling.totalClientesFaturados).toBe(2);
    expect(dataBilling.totalAdicionaisDpBrl).toBe(2100.00); // 350 + 1750
    expect(dataBilling.faturamentoTotalHonorariosBrl).toBe(8400.00); // (1500+350) + (4500+1750+300) = 1850 + 6550 = 8400
    expect(dataBilling.statusFaturamento).toBe('FATURAMENTO_HONORARIOS_PROCESSADO_SUCESSO');
    expect(dataBilling.diagnosticoFaturamento).toContain('Total Faturado: R$ 8.400');
  });

  it('2. Deve apurar ISSQN na emissao em lote de NFS-e do escritorio e calcular inadimplencia', () => {
    const resDunning = processOfficeDunningCollectionEngine({
      escritorioNome: 'Soberano Contabilidade Global',
      loteFaturas: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Restaurante & Bar Central Ltda',
          valorHonorarioBrl: 1850.00,
          diasAtraso: 0, // em dia
          aliquotaIssqnPercent: 3.0 // R$ 55,50
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Indústria Têxtil Brasil S/A',
          valorHonorarioBrl: 6550.00,
          diasAtraso: 15, // inadimplente
          aliquotaIssqnPercent: 3.0 // R$ 196,50
        }
      ]
    });

    const dataDunning = unwrap(resDunning);
    expect(dataDunning.totalNfseEmitidas).toBe(2);
    expect(dataDunning.totalImpostoIssqnDevidoBrl).toBe(252.00); // 55.50 + 196.50
    expect(dataDunning.totalRecebiveisEmDiaBrl).toBe(1850.00);
    expect(dataDunning.totalInadimplenciaBrl).toBe(6550.00);
    expect(dataDunning.statusReguaCobranca).toBe('REGUA_PIX_DISPARADA_SEM_PENDENCIAS');
    expect(dataDunning.diagnosticoDunning).toContain('ISSQN Devido: R$ 252');
  });
});
