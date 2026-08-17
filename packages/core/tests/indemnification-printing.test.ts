import { describe, it, expect } from 'vitest';
import {
  evaluateIndemnificationAssetCpc15,
  processPrintingPackagingStf164TaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Ativos de Indenização em M&A (CPC 15) & Indústria Gráfica (STF Tema 164)', () => {
  it('1. Deve reconhecer ativo de indenizacao do vendedor concomitante ao passivo contingente em M&A (CPC 15 R1)', () => {
    const resIndem = evaluateIndemnificationAssetCpc15({
      aquisicaoId: 'ACQ-03',
      adquirenteNome: 'Soberano Holdings S.A.',
      vendedorGarantidorNome: 'Fundadores Alienantes S.A.',
      contingenciaDescricao: 'Autuação Fiscal Pré-Aquisição de ICMS',
      valorPassivoContingenteReconhecidoBrl: 8000000.00, // 8M Passivo
      limiteMaximoIndenizacaoContratualBrl: 8000000.00 // 8M Ativo
    });

    const dataIndem = unwrap(resIndem);
    expect(dataIndem.valorPassivoContingenteBrl).toBe(8000000.00);
    expect(dataIndem.valorAtivoIndenizacaoReconhecidoBrl).toBe(8000000.00);
    expect(dataIndem.impactoLiquidoPatrimonioLiquidoBrl).toBe(0);
    expect(dataIndem.partidasDobradaAquisicao.length).toBe(2);
    expect(dataIndem.diagnosticoCpc15).toContain('Efeito Neutro no PL');
  });

  it('2. Deve aplicar ICMS/IPI para embalagens industriais e ISSQN exclusivo para impressos de consumo proprio (STF Tema 164)', () => {
    // 2.1 Embalagens Industriais (Integram Cadeia) -> ICMS 18% + IPI 5%
    const resEmbalagem = processPrintingPackagingStf164TaxEngine({
      operacaoId: 'GRAF-01',
      graficaNome: 'Gráfica & Embalagens Soberano S.A.',
      descricaoProduto: 'Caixas Personalizadas para Medicamentos',
      destinacao: 'EMBALAGEM_INTEGRANTE_CADEIA_INDUSTRIAL',
      valorOperacaoBrl: 100000.00,
      aliquotaIcmsPadraoPercent: 18.0,
      aliquotaIpiPadraoPercent: 5.0
    });

    const dataEmbalagem = unwrap(resEmbalagem);
    expect(dataEmbalagem.valorIcmsDevidoBrl).toBe(18000.00);
    expect(dataEmbalagem.valorIpiDevidoBrl).toBe(5000.00);
    expect(dataEmbalagem.valorIssqnDevidoBrl).toBe(0);
    expect(dataEmbalagem.totalTributosDevidosBrl).toBe(23000.00);
    expect(dataEmbalagem.diagnosticoFiscal).toContain('INCIDÊNCIA DE ICMS');

    // 2.2 Impressos Personalizados para Consumo Final -> ISSQN 5% Exclusivo
    const resImpresso = processPrintingPackagingStf164TaxEngine({
      operacaoId: 'GRAF-02',
      graficaNome: 'Gráfica & Embalagens Soberano S.A.',
      descricaoProduto: 'Folders e Cartões de Visita Corporativos',
      destinacao: 'IMPRESSO_CONSUMO_FINAL_ENCOMENDANTE',
      valorOperacaoBrl: 50000.00,
      aliquotaIssqnPadraoPercent: 5.0
    });

    const dataImpresso = unwrap(resImpresso);
    expect(dataImpresso.valorIcmsDevidoBrl).toBe(0);
    expect(dataImpresso.valorIpiDevidoBrl).toBe(0);
    expect(dataImpresso.valorIssqnDevidoBrl).toBe(2500.00);
    expect(dataImpresso.totalTributosDevidosBrl).toBe(2500.00);
    expect(dataImpresso.diagnosticoFiscal).toContain('INCIDÊNCIA EXCLUSIVA DE ISSQN');
  });
});
