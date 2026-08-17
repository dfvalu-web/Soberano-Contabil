import { describe, it, expect } from 'vitest';
import {
  SensibleMutationAuditEngine,
  SecurityEngine,
  evaluateNdfHedgeAccounting,
  calculateReidiTaxSuspension,
  unwrap
} from '../src/index.js';

describe('TESTES: Anti-Fraude Bancária, Hedge Accounting (CPC 48) & REIDI (Infraestrutura)', () => {
  it('1. Deve auditar alteracao de dados bancarios/PIX e sinalizar alerta de risco com 2FA', () => {
    const security = new SecurityEngine();
    const engine = new SensibleMutationAuditEngine(security);

    const res = engine.auditBankAccountChange({
      entidadeId: 'FORN-9988',
      tipoEntidade: 'FORNECEDOR',
      nomeEntidade: 'Construtora Vale do Sol Ltda',
      usuarioResponsavelAlteracaoId: 'USR-OPERADOR-01',
      dadosBancariosAnteriores: {
        banco: '341',
        agencia: '1234',
        conta: '56789-0',
        chavePix: 'financeiro@valedosol.com.br'
      },
      novosDadosBancarios: {
        banco: '260',
        agencia: '0001',
        conta: '998877-6',
        chavePix: '11999998888' // Alteração de chave PIX
      },
      justificativaAlteracao: 'Solicitação de troca de domicílio bancário assinada pela diretoria financeira.'
    });

    const data = unwrap(res);
    expect(data.alertaRiscoFraude).toBe(true);
    expect(data.statusAprovacao).toBe('PENDENTE_CONFIRMACAO_DUPLA_2FA');
    expect(data.hashRegistroNovo).toBeDefined();
    expect(data.mensagemAlerta).toContain('Atenção: Houve alteração de chave PIX');
  });

  it('2. Deve mensurar derivativo cambial NDF (CPC 48 / IFRS 9) e reconhecer em DRA no PL', () => {
    const res = evaluateNdfHedgeAccounting({
      contratoId: 'NDF-USD-SOJA-2026',
      instituicaoFinanceiraContraparte: 'Banco Itaú BBA SA',
      moedaEstrangeira: 'USD',
      montanteNocionalMoedaEstrangeira: 1000000.00, // $ 1M
      taxaCambialTermoPactuada: 5.20, // R$ 5.2M
      taxaCambialSpotFechamento: 5.50, // R$ 5.5M => Ganho de R$ 300k
      tipoHedge: 'HEDGE_DE_FLUXO_DE_CAIXA_DRA',
      objetoProtegidoDescricao: 'Exportação futura de 20.000 sacas de soja'
    });

    const data = unwrap(res);
    expect(data.ganhoOuPerdaNdfBrl).toBe(300000.00);
    expect(data.tipoResultadoNdf).toBe('GANHO_DERIVATIVO');
    expect(data.destinoContabil).toBe('OUTROS_RESULTADOS_ABRANGENTES_PL');
    expect(data.partidasDobradaHedge.length).toBe(2);
    expect(data.partidasDobradaHedge[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaHedge[1]!.type).toBe('CREDIT');
  });

  it('3. Deve calcular suspensao tributaria de 9,25% PIS/COFINS em projeto REIDI (Lei 11.488/2007)', () => {
    const res = calculateReidiTaxSuspension({
      projetoHabilitadoId: 'PROJ-SOLAR-BAHIA-01',
      setorInfraestrutura: 'ENERGIA',
      numeroPortariaMinisterialHabilitacao: 'Portaria MME nº 450/2025',
      valorTotalAquisicoesBensCapitalServicos: 10000000.00 // R$ 10 Milhões
    });

    const data = unwrap(res);
    expect(data.valorTotalAquisicoes).toBe(10000000.00);
    expect(data.suspensaoTributariaApurada.pisSuspenso1_65Percent).toBe(165000.00);
    expect(data.suspensaoTributariaApurada.cofinsSuspensa7_60Percent).toBe(760000.00);
    expect(data.suspensaoTributariaApurada.totalPisCofinsSuspenso9_25Percent).toBe(925000.00);
    expect(data.desembolsoFinanceiroLiquido).toBe(9075000.00);
    expect(data.diagnosticoReidi).toContain('REIDI (Lei nº 11.488/2007)');
  });
});
