import { describe, it, expect } from 'vitest';
import {
  processOfficeDailyAccountingOperationsEngine,
  processOfficeDailyTaxOperationsEngine,
  processOfficeDailyPayrollOperationsEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Operações Diárias — Contábil, Fiscal & RH/DP', () => {
  it('1. Deve conciliar extrato bancario OFX gerando partidas dobradas sem diferencas', () => {
    const resAcc = processOfficeDailyAccountingOperationsEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio Varejista Moderna Ltda',
      bancoCodigo: '341',
      saldoInicialExtratoBrl: 50000.00,
      transacoesExtrato: [
        {
          dataTransacao: '2026-08-01',
          documentoNumero: 'DOC101',
          descricaoExtrato: 'PIX RECEBIDO CLIENTE XYZ',
          valorTransacaoBrl: 15000.00,
          tipoTransacao: 'CREDITO_ENTRADA'
        },
        {
          dataTransacao: '2026-08-02',
          documentoNumero: 'DOC102',
          descricaoExtrato: 'TED PAGTO FORNECEDOR ABC',
          valorTransacaoBrl: 8000.00,
          tipoTransacao: 'DEBITO_SAIDA'
        }
      ]
    });

    const dataAcc = unwrap(resAcc);
    expect(dataAcc.totalTransacoesProcessadas).toBe(2);
    expect(dataAcc.totalEntradasBrl).toBe(15000.00);
    expect(dataAcc.totalSaidasBrl).toBe(8000.00);
    expect(dataAcc.saldoFinalExtratoBrl).toBe(57000.00); // 50k + 15k - 8k
    expect(dataAcc.lancamentosPartidasDobradas.length).toBe(2);
    expect(dataAcc.statusConciliacao).toBe('EXTRATO_BANCARIO_100_CONCILIADO_PARTIDAS_DOBRADAS');
    expect(dataAcc.diagnosticoContabil).toContain('sem diferenças');
  });

  it('2. Deve apurar tributos e emitir guias com codigo de barras e Pix Copia e Cola', () => {
    const resTax = processOfficeDailyTaxOperationsEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Serviços Médicos & Consultoria S/S',
      mesCompetencia: '2026-08',
      regimeTributario: 'SIMPLES_NACIONAL',
      faturamentoServicosBrl: 100000.00,
      faturamentoComercioBrl: 0,
      aliquotaEfetivaPercent: 6.0
    });

    const dataTax = unwrap(resTax);
    expect(dataTax.totalFaturamentoBrl).toBe(100000.00);
    expect(dataTax.totalTributosApuradosBrl).toBe(6000.00);
    expect(dataTax.guiasRecolhimento.length).toBe(1);
    expect(dataTax.guiasRecolhimento[0].codigoTributo).toBe('DAS');
    expect(dataTax.guiasRecolhimento[0].pixCopiaECola).toContain('br.gov.bcb.pix');
    expect(dataTax.statusApuracao).toBe('APURACAO_FISCAL_CONCLUIDA_GUIAS_GERADAS');
  });

  it('3. Deve processar folha de pagamento, pro-labore e fechar eSocial S-1299', () => {
    const resPay = processOfficeDailyPayrollOperationsEngine({
      clienteCnpj: '33.333.333/0001-33',
      razaoSocial: 'Tecnologia & Softwares Brasil Ltda',
      mesCompetencia: '2026-08',
      funcionarios: [
        {
          cpf: '111.111.111-11',
          nome: 'Lucas Desenvolvedor Senior',
          salarioBaseBrl: 10000.00,
          horasExtras50Brl: 1000.00,
          horasExtras100Brl: 0,
          dsrHorasExtrasBrl: 200.00,
          adicionalInsalubridadeOuPericulosidadeBrl: 0,
          faltasAtrasosDescontoBrl: 0,
          dependentesIrrfQtd: 1
        }
      ],
      sociosProLabore: [
        {
          cpf: '222.222.222-22',
          nomeSocio: 'Carlos Sócio Administrador',
          valorProLaboreBrl: 5000.00
        }
      ]
    });

    const dataPay = unwrap(resPay);
    expect(dataPay.totalFuncionarios).toBe(1);
    expect(dataPay.totalSociosProLabore).toBe(1);
    expect(dataPay.totalFolhaBrutaBrl).toBe(16200.00); // 11.2k clt + 5k pro-labore
    expect(dataPay.totalFgtsDigitalBrl).toBeGreaterThan(0);
    expect(dataPay.holeritesEmitidos.length).toBe(2);
    expect(dataPay.statusFechamentoEsocial).toBe('FOLHA_FECHADA_EVENTO_S1299_TRANSMITIDO');
    expect(dataPay.diagnosticoPayroll).toContain('eSocial S-1299 fechado com sucesso');
  });
});
