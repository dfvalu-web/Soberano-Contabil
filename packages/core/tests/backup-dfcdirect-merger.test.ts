import { describe, it, expect } from 'vitest';
import {
  EncryptedBackupEngine,
  SecurityEngine,
  calculateDfcDirectMethod,
  evaluateCorporateRestructuring,
  unwrap
} from '../src/index.js';

describe('TESTES: Backup Criptografado AES-256-GCM, DFC Método Direto & M&A Societário', () => {
  it('1. Deve gerar pacote de backup cifrado AES-256-GCM com Merkle Seal e validar restauração dry-run', () => {
    const security = new SecurityEngine();
    const engine = new EncryptedBackupEngine(security);

    const chaveMestra = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const payloadBruto = JSON.stringify({
      ledger: ['block-01', 'block-02'],
      contas: ['1.1.1.01', '2.1.1.01'],
      saldoTotal: 1500000.00
    });

    const resBackup = engine.createEncryptedBackup(
      {
        tenantId: 'tenant-01',
        timestamp: new Date().toISOString(),
        totalLancamentos: 2,
        totalContas: 2,
        dadosJsonBrutos: payloadBruto
      },
      chaveMestra
    );

    const backupPkg = unwrap(resBackup);
    expect(backupPkg.algoritmoCifragem).toBe('AES-256-GCM');
    expect(backupPkg.merkleRootIntegridadeSha256).toBeDefined();
    expect(backupPkg.conteudoCifradoHex.length).toBeGreaterThan(0);

    // Dry-run restore
    const resRestore = engine.verifyAndRestoreBackup(backupPkg, chaveMestra);
    const restoreReport = unwrap(resRestore);
    expect(restoreReport.restauracaoValida).toBe(true);
    expect(restoreReport.merkleIntegrityMatch).toBe(true);
    expect(restoreReport.mensagem).toContain('100% íntegros');
  });

  it('2. Deve calcular DFC pelo Método Direto (CPC 03 R2) e conciliar com disponibilidades', () => {
    const res = calculateDfcDirectMethod({
      periodoAno: 2026,
      recebimentoDeClientes: 5000000.00,
      pagamentoAFornecedores: 2000000.00,
      pagamentoAEmpregadosEEncargos: 1000000.00,
      pagamentoDeTributosOperacionais: 500000.00,
      pagamentoDeJuros: 100000.00, // Operacional = 1.400.000,00
      aquisicaoDeImobilizadoEIntangivel: 600000.00,
      recebimentoPorAlienacaoDeAtivos: 100000.00, // Investimento = -500.000,00
      integralizacaoDeCapitalSocial: 500000.00,
      captacaoDeEmprestimosFinanciamentos: 400000.00,
      amortizacaoDeEmprestimosEArrendamentos: 300000.00,
      pagamentoDeDividendosEJcp: 200000.00, // Financiamento = +400.000,00
      saldoDisponibilidadesInicial: 200000.00 // Total variação = 1.300.000,00 => Final = 1.500.000,00
    });

    const data = unwrap(res);
    expect(data.fluxoCaixaAtividadesOperacionais).toBe(1400000.00);
    expect(data.fluxoCaixaAtividadesInvestimento).toBe(-500000.00);
    expect(data.fluxoCaixaAtividadesFinanciamento).toBe(400000.00);
    expect(data.aumentoOuReducaoLiquidaDisponibilidades).toBe(1300000.00);
    expect(data.saldoDisponibilidadesFinal).toBe(1500000.00);
    expect(data.conciliadoComSaldoBancario).toBe(true);
  });

  it('3. Deve avaliar reestruturacao societaria de Cisao Parcial e aplicar travas do Art. 581 do RIR/2018', () => {
    const res = evaluateCorporateRestructuring({
      tipoOperacao: 'CISAO_PARCIAL',
      empresaSucedidaNome: 'Indústrias Alfa S.A.',
      empresaSucessoraNome: 'Beta Logística Ltda',
      percentualPatrimonioLiquidoVertido: 40, // 40% vertido
      acervoLiquidoContabilVertido: 4000000.00,
      acervoLiquidoValorMercadoVertido: 5000000.00, // Ganho de 1.000.000,00
      saldoPrejuizoFiscalIrpjSucedida: 1000000.00, // 40% extinto (400k) / 60% mantido (600k)
      saldoCreditosTributariosPendenteSucedida: 500000.00 // 40% transferido (200k)
    });

    const data = unwrap(res);
    expect(data.ganhoDeCapitalNaOperacao).toBe(1000000.00);
    expect(data.tributacaoGanhoCapital34Percent).toBe(340000.00);
    expect(data.sucessaoPrejuizoFiscal.saldoPrejuizoAproveitavelSucessora).toBe(600000.00);
    expect(data.sucessaoPrejuizoFiscal.saldoPrejuizoPerdidoExtinto).toBe(400000.00);
    expect(data.sucessaoCreditosTributarios.creditosTransferiveisSucessora).toBe(200000.00);
  });
});
