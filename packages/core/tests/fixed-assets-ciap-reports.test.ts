import { describe, it, expect } from 'vitest';
import {
  calculateAssetDepreciation,
  calculateCiapBlocoG,
  generateExecutiveDossier,
  FixedAssetItem,
  Company,
  unwrap
} from '../src/index.js';

describe('TESTES: Ativo Imobilizado (CPC 27), CIAP (Bloco G) & Dossiê Executivo', () => {
  const mockCompany: Company = {
    id: 'comp-01',
    tenantId: 'tenant-01',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO INDUSTRIA E TECNOLOGIA S/A',
    nomeFantasia: 'Soberano Indústria',
    cnaePrincipal: '2621300',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('1. Deve calcular depreciacao linear CPC 27 com valor residual e gerar partidas dobradas', () => {
    const asset: FixedAssetItem = {
      id: 'AST-01',
      tenantId: 'tenant-01',
      codigoPatrimonial: 'PAT-001',
      descricao: 'Servidor Dell PowerEdge R750',
      categoria: 'EQUIPAMENTOS_INFORMATICA',
      dataAquisicao: '2026-01-01',
      dataInicioDepreciacao: '2026-01-01',
      custoAquisicao: 60000.00,
      valorResidualEstimado: 6000.00, // Base depreciável = 54.000,00
      vidaUtilAnos: 5, // 60 meses => 900,00/mês
      taxaDepreciacaoAnualPercent: 20,
      depreciacaoAcumuladaAnterior: 0
    };

    const res = calculateAssetDepreciation(asset, '2026-01');
    const data = unwrap(res);

    expect(data.baseCalculoDepreciavel).toBe(54000.00);
    expect(data.depreciacaoMensal).toBe(900.00);
    expect(data.novaDepreciacaoAcumulada).toBe(900.00);
    expect(data.valorContabilLiquido).toBe(59100.00);
    expect(data.partidasDobradaSugeridas.length).toBe(2);
    expect(data.partidasDobradaSugeridas[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaSugeridas[1]!.type).toBe('CREDIT');
  });

  it('2. Deve calcular apropriacao de CIAP 1/48 avos conforme LC 87/96 e Bloco G', () => {
    const res = calculateCiapBlocoG({
      codigoBem: 'PAT-001',
      descricaoBem: 'Servidor Dell',
      numeroNotaFiscal: 'NF-100',
      dataEntrada: '2026-01-01',
      valorIcmsTotalDestacado: 4800.00, // 1/48 = 100,00
      parcelaAtualMes: 1,
      saidasTributadasMes: 80000.00,
      saidasExportacaoImunesMes: 20000.00,
      totalGeralSaidasMes: 100000.00 // Fator = 100%
    });

    const data = unwrap(res);
    expect(data.valorFracao1_48Avos).toBe(100.00);
    expect(data.fatorApropriacaoIcmsPercent).toBe(100.00);
    expect(data.creditoIcmsApropriavelMes).toBe(100.00);
    expect(data.saldoIcmsARecuperarRemanescente).toBe(4700.00);
  });

  it('3. Deve gerar Dossie Executivo Oficial consolidado sem ressalvas', () => {
    const mockBalanceSheet = {
      periodo: '2026-01',
      ativoCirculante: [],
      ativoNaoCirculante: [],
      totalAtivo: 1000000.00,
      passivoCirculante: [],
      passivoNaoCirculante: [],
      totalPassivo: 400000.00,
      patrimonioLiquido: [],
      totalPatrimonioLiquido: 600000.00,
      totalPassivoEPatrimonioLiquido: 1000000.00,
      isEquilibrado: true
    };

    const mockIncomeStatement = {
      periodo: '2026-01',
      linhas: [
        { codigo: '1', descricao: 'Receita Bruta', valorPeriodoAtual: 500000.00, isDestaque: true },
        { codigo: '3', descricao: 'Receita Líquida', valorPeriodoAtual: 450000.00, isDestaque: true },
        { codigo: '8', descricao: 'Lucro Líquido do Exercício', valorPeriodoAtual: 90000.00, isDestaque: true }
      ],
      lucroLiquidoExercicio: 90000.00
    };

    const res = generateExecutiveDossier(mockCompany, mockBalanceSheet, mockIncomeStatement, 100);
    const data = unwrap(res);

    expect(data.cabecalho.empresa).toBe(mockCompany.razaoSocial);
    expect(data.resumoFinanceiro.totalAtivo).toBe(1000000.00);
    expect(data.resumoFinanceiro.lucroLiquidoPeriodo).toBe(90000.00);
    expect(data.resumoFinanceiro.margemLiquidaPercent).toBe(20.00);
    expect(data.governancaESeguranca.scoreConformidadeFiscal).toBe(100);
    expect(data.conclusoesAuditoria.length).toBe(3);
  });
});
