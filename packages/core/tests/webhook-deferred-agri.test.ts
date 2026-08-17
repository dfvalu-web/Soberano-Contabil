import { describe, it, expect } from 'vitest';
import {
  WebhookDispatcher,
  SecurityEngine,
  calculateDeferredTaxCpc32,
  evaluateBiologicalAssetCpc29,
  generateLcdprFile,
  unwrap
} from '../src/index.js';

describe('TESTES: Webhook Dispatcher, Tributos Diferidos (CPC 32) & Agronegócio LCDPR (CPC 29)', () => {
  it('1. Deve despachar evento contábil/fiscal via webhook assinado com HMAC-SHA256', () => {
    const security = new SecurityEngine();
    const dispatcher = new WebhookDispatcher(security);

    const res = dispatcher.dispatchEvent(
      {
        id: 'SUB-ERP-LEGADO-01',
        urlDestino: 'https://api.erp-legado.com.br/webhooks/contabil',
        secretKeyHmac: 'secret_hmac_key_998877',
        eventosInscritos: ['FECHAMENTO_MENSAL_CONCLUIDO'],
        ativo: true
      },
      {
        eventId: 'EVT-FECHAMENTO-2026-01',
        eventType: 'FECHAMENTO_MENSAL_CONCLUIDO',
        timestamp: '2026-01-31T23:59:59Z',
        tenantId: 'tenant-soberano-01',
        data: {
          periodo: '2026-01',
          totalAtivo: 5000000.00,
          lucroLiquido: 350000.00
        }
      }
    );

    const data = unwrap(res);
    expect(data.statusEntrega).toBe('ENTREGUE_200_OK');
    expect(data.hmacSignatureHeader).toContain('sha256=');
    expect(data.urlDestino).toContain('https://');
  });

  it('2. Deve apurar Ativos e Passivos Fiscais Diferidos (DTA/DTL - CPC 32) com teste de realizabilidade', () => {
    const res = calculateDeferredTaxCpc32({
      periodoAno: 2026,
      saldoPrejuizoFiscalIrpjAcumulado: 500000.00, // DTA IRPJ 25% = 125.000,00
      saldoBaseNegativaCsllAcumulada: 500000.00, // DTA CSLL 9% = 45.000,00
      adicoesTemporariasDedutiveisFuturas: 100000.00, // DTA 34% = 34.000,00 (Total DTA = 204.000,00)
      exclusoesTemporariasTributaveisFuturas: 50000.00, // DTL 34% = 17.000,00
      lucroTributavelEstimadoProximos10Anos: 3000000.00 // 30% = 900k > 500k => Aprovado
    });

    const data = unwrap(res);
    expect(data.ativoFiscalDiferidoDta.totalAtivoFiscalDiferido).toBe(204000.00);
    expect(data.passivoFiscalDiferidoDtl.totalPassivoFiscalDiferido).toBe(17000.00);
    expect(data.posicaoLiquidaFiscalDiferida).toBe(187000.00); // 204k - 17k
    expect(data.testeRealizabilidade10AnosAprovado).toBe(true);
    expect(data.partidasDobradaDta.length).toBe(2);
  });

  it('3. Deve avaliar ativos biologicos a valor justo (CPC 29) e gerar arquivo oficial do LCDPR', () => {
    // 3.1 Ativos Biológicos (Rebanho Bovino)
    const resBio = evaluateBiologicalAssetCpc29({
      ativoBiologicoId: 'REBANHO-NELORE-01',
      tipoAtivo: 'REBANHO_BOVINO',
      quantidadeUnidades: 500, // 500 cabeças
      cotacaoMercadoPorUnidade: 4000.00,
      despesasEstimadasPontoVendaPorUnidade: 200.00, // Preço líquido = 3.800,00 => Total = 1.900.000,00
      custoContabilAnteriorTotal: 1500000.00 // Ganho de 400.000,00
    });

    const dataBio = unwrap(resBio);
    expect(dataBio.valorJustoLiquidoTotal).toBe(1900000.00);
    expect(dataBio.variacaoValorJustoResultado).toBe(400000.00);
    expect(dataBio.tipoVariacao).toBe('GANHO_VALOR_JUSTO');
    expect(dataBio.partidasDobradaAtivoBiologico.length).toBe(2);

    // 3.2 Livro Caixa Digital do Produtor Rural (LCDPR)
    const resLcdpr = generateLcdprFile({
      cpfProdutorRural: '123.456.789-00',
      nomeProdutorRural: 'Joaquim da Silva Agro',
      anoExercicio: 2026,
      imovelRuralNome: 'Fazenda Santa Tereza',
      nirfImovel: '1234567-8',
      receitasDaAtividadeRuralTotal: 2500000.00,
      despesasDeCusteioEInvestimentoTotal: 1800000.00
    });

    const dataLcdpr = unwrap(resLcdpr);
    expect(dataLcdpr.resultadoAtividadeRural).toBe(700000.00);
    expect(dataLcdpr.opcaoTributacao).toBe('ARBITRAMENTO_20_PERCENT'); // 700k > 500k (20%)
    expect(dataLcdpr.arquivoLcdprTxt).toContain('0000|LCDPR');
    expect(dataLcdpr.arquivoLcdprTxt).toContain('Fazenda Santa Tereza'.toUpperCase());
    expect(dataLcdpr.arquivoLcdprTxt).toContain('9999|12345678900');
  });
});
