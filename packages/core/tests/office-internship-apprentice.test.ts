import { describe, it, expect } from 'vitest';
import {
  processOfficeInternshipContractAuditEngine,
  processOfficeYoungApprenticeQuotaEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Estágios & Menor Aprendiz (Lei 11.788/08, Lei 10.097/00 e eSocial)', () => {
  it('1. Deve auditar contrato de estagio e certificar conformidade formal com Lei 11.788/08 e eSocial S-2300', () => {
    const resInt = processOfficeInternshipContractAuditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Agência de Publicidade e Tecnologia Ltda',
      estagiarioCpf: '123.456.789-00',
      nomeEstagiario: 'Lucas Menezes (Estudante TI)',
      instituicaoEnsinoNome: 'Universidade de São Paulo - USP',
      valorBolsaAuxilioBrl: 2200.00,
      horasSemanais: 30, // Máximo legal de 30h
      apoliceSeguroNumero: 'APOL-BR-87452109',
      dataInicioEstagio: '2025-08-01',
      mesesDecorridosEstagio: 12 // <= 24 meses
    });

    const dataInt = unwrap(resInt);
    expect(dataInt.horasSemanaisEmConformidade).toBe(true);
    expect(dataInt.duracaoMaximaEmConformidade).toBe(true);
    expect(dataInt.categoriaEsocial).toBe('901_ESTAGIARIO_SEM_VINCULO');
    expect(dataInt.eventoEsocial).toBe('S-2300');
    expect(dataInt.statusEstagio).toBe('CONTRATO_ESTAGIO_100_CONFORME_LEI_11788');
    expect(dataInt.diagnosticoEstagio).toContain('CONTRATO_ESTAGIO_100_CONFORME_LEI_11788');
  });

  it('2. Deve calcular cota legal de menor aprendiz (5% a 15%) e aliquota de FGTS reduzida (2%)', () => {
    const resApp = processOfficeYoungApprenticeQuotaEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Indústria Metalúrgica do Vale S/A',
      totalEmpregadosFuncoesFormacaoProfissional: 100, // 5% = 5 aprendizes
      aprendizesContratadosCount: 5,
      folhaPagamentoAprendizesBrl: 7500.00
    });

    const dataApp = unwrap(resApp);
    expect(dataApp.cotaMinimaObrigatoria5PercentCount).toBe(5);
    expect(dataApp.cotaMaximaPermitida15PercentCount).toBe(15);
    expect(dataApp.aprendizesAtuaisCount).toBe(5);
    expect(dataApp.aliquotaFgtsAprendizPercent).toBe(2.0);
    expect(dataApp.valorFgtsRecolhidoBrl).toBe(150.00); // 2% de 7500
    expect(dataApp.statusCotaAprendizagem).toBe('COTA_LEGAL_CUMPRIDA');
    expect(dataApp.diagnosticoCota).toContain('COTA_LEGAL_CUMPRIDA');
  });
});
