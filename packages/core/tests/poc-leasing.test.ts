import { describe, it, expect } from 'vitest';
import {
  evaluateLongTermConstructionPocCpc47,
  processLeasingAndComodatoTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Contratos de Construção POC (CPC 47) & Locação/Comodato (Súmula 31 STF)', () => {
  it('1. Deve apurar receita acumulada por POC, Ativo de Contrato e perdas onerosas (CPC 47 / IFRS 15)', () => {
    // 1.1 Obra Regular com Ativo de Contrato (Receita > Faturado)
    const resPoc = evaluateLongTermConstructionPocCpc47({
      obraId: 'OBRA-HOSPITAL-01',
      descricaoObra: 'Construção do Complexo Hospitalar Metropolitano',
      valorTotalContratoBrl: 100000000.00,
      custoTotalEstimadoObraBrl: 80000000.00,
      custosIncorridosAteDataBrl: 48000000.00, // 48M / 80M = 60%
      faturamentoEmitidoAteDataBrl: 50000000.00 // Receita = 60M -> Ativo de Contrato = 10M
    });

    const dataPoc = unwrap(resPoc);
    expect(dataPoc.percentualEvolucaoPocPercent).toBe(60.0);
    expect(dataPoc.receitaAcumuladaReconhecidaBrl).toBe(60000000.00);
    expect(dataPoc.saldoAtivoOuPassivoDeContrato.tipo).toBe('ATIVO_DE_CONTRATO_RECEITA_A_FATURAR');
    expect(dataPoc.saldoAtivoOuPassivoDeContrato.valorBrl).toBe(10000000.00);
    expect(dataPoc.contratoOnerosoComPerdaEsperada).toBe(false);
    expect(dataPoc.partidasDobradaPoc.length).toBe(2);
    expect(dataPoc.diagnosticoCpc47).toContain('CPC 47 / IFRS 15 (Contratos de Construção - Método POC)');

    // 1.2 Contrato Oneroso (Custo > Receita)
    const resOneroso = evaluateLongTermConstructionPocCpc47({
      obraId: 'OBRA-PONTE-02',
      descricaoObra: 'Ponte Estaiada do Rio Grande',
      valorTotalContratoBrl: 50000000.00,
      custoTotalEstimadoObraBrl: 60000000.00, // Perda total = 10M
      custosIncorridosAteDataBrl: 30000000.00, // 50%
      faturamentoEmitidoAteDataBrl: 25000000.00 // Receita = 25M
    });

    const dataOneroso = unwrap(resOneroso);
    expect(dataOneroso.contratoOnerosoComPerdaEsperada).toBe(true);
    expect(dataOneroso.perdaEsperadaImediataBrl).toBe(10000000.00);
    expect(dataOneroso.partidasDobradaPoc.length).toBe(2); // Provisão oneroso
    expect(dataOneroso.diagnosticoCpc47).toContain('Contrato Oneroso');
  });

  it('2. Deve aplicar nao incidencia de ICMS/ISS na remessa e tributar faturamento mensal de locacao (STF Súmula 31)', () => {
    // 2.1 Remessa de Locação (CFOP 5.908)
    const resRem = processLeasingAndComodatoTaxEngine({
      operacaoId: 'LOC-01',
      tipoOperacao: 'REMESSA_LOCACAO_BENS',
      clienteLocatarioNome: 'Construtora Monumental S.A.',
      valorOperacaoBrl: 500000.00,
      custoAtivoImobilizadoBrl: 400000.00
    });

    const dataRem = unwrap(resRem);
    expect(dataRem.tributacaoIncidentes.icmsDevidoBrl).toBe(0);
    expect(dataRem.tributacaoIncidentes.issDevidoBrl).toBe(0);
    expect(dataRem.partidasDobradaLocacao.length).toBe(2);
    expect(dataRem.diagnosticoFiscal).toContain('SÚMULA VINCULANTE Nº 31 DO STF');

    // 2.2 Faturamento Mensal de Aluguel
    const resFat = processLeasingAndComodatoTaxEngine({
      operacaoId: 'LOC-01',
      tipoOperacao: 'FATURAMENTO_MENSAL_LOCACAO',
      clienteLocatarioNome: 'Construtora Monumental S.A.',
      valorOperacaoBrl: 100000.00
    });

    const dataFat = unwrap(resFat);
    expect(dataFat.tributacaoIncidentes.icmsDevidoBrl).toBe(0);
    expect(dataFat.tributacaoIncidentes.issDevidoBrl).toBe(0);
    expect(dataFat.tributacaoIncidentes.pisDevido9_25PercentBrl).toBe(1650.00);
    expect(dataFat.tributacaoIncidentes.cofinsDevido9_25PercentBrl).toBe(7600.00);
    expect(dataFat.tributacaoIncidentes.totalTributosBrl).toBe(9250.00);
    expect(dataFat.partidasDobradaLocacao.length).toBe(2);
  });
});
