import { describe, it, expect } from 'vitest';
import {
  runBenfordForensicAudit,
  calculateRevenueRecognitionCpc47,
  processCreditRecoveryPerDcomp,
  unwrap
} from '../src/index.js';

describe('TESTES: Auditoria Forense Benford, Receitas (CPC 47 / IFRS 15) & PER/DCOMP', () => {
  it('1. Deve rodar auditoria forense com Lei de Benford e identificar conformidade estatistica', () => {
    // Gerar amostra conforme distribuicao natural
    const amostra: number[] = [
      120.50, 1500.00, 18900.00, 134.00, 199.90,
      250.00, 2800.00, 24000.00,
      310.00, 3900.00,
      420.00, 4800.00,
      550.00, 620.00, 710.00, 850.00, 920.00
    ];

    const res = runBenfordForensicAudit(amostra);
    const data = unwrap(res);

    expect(data.totalAmostrasAnalisadas).toBe(amostra.length);
    expect(data.distribuicaoPorDigito.length).toBe(9);
    expect(data.distribuicaoPorDigito[0]!.digito).toBe(1);
    expect(data.desvioMedioAbsolutoMad).toBeGreaterThanOrEqual(0);
  });

  it('2. Deve aplicar modelo de 5 etapas do CPC 47 / IFRS 15 para reconhecimento de receitas', () => {
    const res = calculateRevenueRecognitionCpc47({
      contratoId: 'CTR-SAAS-ENG-001',
      clienteNome: 'Construtora Horizonte SA',
      precoTotalTransacao: 500000.00,
      obrigacoesDesempenho: [
        {
          id: 'OB-01-LICENCA',
          descricao: 'Licença de Software perpétua',
          precoVendaIndividualEstimado: 200000.00,
          custoTotalEstimado: 0,
          custoIncorridoAcumulado: 0,
          metodoReconhecimento: 'PONTO_NO_TEMPO_ENTREGA',
          isEntreguePontoNoTempo: true // 100% entregue
        },
        {
          id: 'OB-02-CUSTOMIZACAO',
          descricao: 'Customização de Módulos de Engenharia',
          precoVendaIndividualEstimado: 300000.00,
          custoTotalEstimado: 100000.00,
          custoIncorridoAcumulado: 50000.00, // 50% de avanço (POC)
          metodoReconhecimento: 'AO_LONGO_DO_TEMPO_POC'
        }
      ]
    });

    const data = unwrap(res);
    expect(data.precoTotalTransacao).toBe(500000.00);
    // Licença (200k) + Customização 50% de 300k (150k) = 350.000,00
    expect(data.receitaTotalReconhecidaNoPeriodo).toBe(350000.00);
    expect(data.saldoPassivoDeContratoReceitaDiferida).toBe(150000.00);
    expect(data.partidasDobradaReceita.length).toBe(2);
  });

  it('3. Deve processar compensacao cruzada PER/DCOMP Web de creditos acumulados contra DCTFWeb', () => {
    const mockCompany = {
      id: 'comp-01',
      razaoSocial: 'Soberano Exportações & Indústria SA',
      cnpj: '12.345.678/0001-95',
      regimeTributario: 'LUCRO_REAL' as const,
      cnae: '2829-1/99',
      uf: 'SP',
      ativo: true
    };

    const res = processCreditRecoveryPerDcomp(mockCompany, {
      tipoCredito: 'PIS_COFINS_EXPORTACAO_NAO_CUMULATIVO',
      periodoApuracao: '2026-01',
      valorSaldoCredorTotal: 250000.00,
      valorDebitosPropriosCompensaveisNoPeriodo: 50000.00, // Sobram 200.000,00
      debitosTributosFederaisParaCompensacaoCruzadaDctfWeb: {
        irpjDevido: 60000.00,
        csllDevida: 30000.00,
        inssPrevidenciarioPatronal: 40000.00 // Total cruzado = 130.000,00 => Sobram 70.000,00
      }
    });

    const data = unwrap(res);
    expect(data.valorCreditoAcumuladoTotal).toBe(250000.00);
    expect(data.valorCompensadoProprio).toBe(50000.00);
    expect(data.planoCompensacaoCruzadaPerDcomp.totalCompensadoCruzado).toBe(130000.00);
    expect(data.planoCompensacaoCruzadaPerDcomp.saldoRemanescenteParaPedidoRessarcimentoDinheiro).toBe(70000.00);
    expect(data.numeroControlePerDcompSugerido).toContain('PERDCOMP-12345678');
  });
});
