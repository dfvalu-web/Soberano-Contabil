import { describe, it, expect } from 'vitest';
import {
  CloudA3Signer,
  SecurityEngine,
  evaluateContingencies,
  calculateTransferPricingAdjustment,
  unwrap
} from '../src/index.js';

describe('TESTES: Assinador Cloud A3, Contingências (CPC 25) & Preços de Transferência (OCDE)', () => {
  it('1. Deve assinar documento XML via Cloud A3 Signer com nó Signature XMLDSig', () => {
    const security = new SecurityEngine();
    const signer = new CloudA3Signer(security);

    const xmlExemplo = '<NFe><infNFe Id="NFe35260112345678000195550010000000011000000015"><ide><nNF>1</nNF></ide></infNFe></NFe>';

    const res = signer.signXmlDocument({
      provedor: 'BIRD_ID',
      clientId: 'CLIENT-SOBERANO-01',
      tokenAcessoOAuth: 'oauth_token_bearer_123456',
      pinDinamico2FA: '9876',
      conteudoXmlParaAssinar: xmlExemplo,
      tagAlvoAssinatura: 'infNFe'
    });

    const data = unwrap(res);
    expect(data.provedor).toBe('BIRD_ID');
    expect(data.algoritmoAssinatura).toBe('RSA-SHA256');
    expect(data.xmlAssinado).toContain('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"');
    expect(data.statusCertificado).toBe('VALIDO_ICP_BRASIL');
  });

  it('2. Deve classificar contingencias trabalhistas e tributarias conforme CPC 25 e provisionar perdas provaveis', () => {
    const res = evaluateContingencies([
      {
        processoId: 'PROC-TRAB-01',
        numeroProcesso: '0010234-55.2025.5.02.0001',
        tipo: 'TRABALHISTA',
        parteContraria: 'Ex-Empregado Reclamante',
        valorCausa: 150000.00,
        melhorEstimativaPerda: 80000.00,
        probabilidadePerda: 'PROVAVEL', // Deve provisionar R$ 80.000,00
        parecerJuridicoResumido: 'Risco provável de horas extras e equiparação salarial.'
      },
      {
        processoId: 'PROC-TRIB-02',
        numeroProcesso: '5001234-88.2024.4.03.6100',
        tipo: 'TRIBUTARIA',
        parteContraria: 'Fazenda Nacional',
        valorCausa: 500000.00,
        melhorEstimativaPerda: 500000.00,
        probabilidadePerda: 'POSSIVEL', // Apenas nota explicativa
        parecerJuridicoResumido: 'Discussão sobre exclusão do ICMS da base do PIS/COFINS - Risco possível.'
      },
      {
        processoId: 'PROC-CIV-03',
        numeroProcesso: '1004567-11.2025.8.26.0100',
        tipo: 'CIVEL',
        parteContraria: 'Fornecedor de Serviços',
        valorCausa: 50000.00,
        melhorEstimativaPerda: 0,
        probabilidadePerda: 'REMOTA', // Sem provisão e sem nota
        parecerJuridicoResumido: 'Cobrança indevida sem lastro contratual - Risco remoto.'
      }
    ]);

    const data = unwrap(res);
    expect(data.totalProcessosAnalisados).toBe(3);
    expect(data.totalProvisaoPassivoReconhecida).toBe(80000.00);
    expect(data.totalContingenciaPossivelDivulgadaNota).toBe(500000.00);
    expect(data.totalRiscoRemoto).toBe(50000.00);
    expect(data.partidasDobradaProvisao.length).toBe(2);
    expect(data.partidasDobradaProvisao[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaProvisao[1]!.type).toBe('CREDIT');
  });

  it('3. Deve apurar ajuste de Precos de Transferencia (Lei 14.596/2023 - OCDE) e calcular adicao no LALUR', () => {
    const res = calculateTransferPricingAdjustment({
      transacaoId: 'TP-IMPORT-CHIPS-01',
      tipoOperacao: 'IMPORTACAO',
      parteRelacionadaNome: 'Soberano Global Tech Inc (EUA)',
      paisParteRelacionada: 'ESTADOS_UNIDOS',
      metodoAplicado: 'PIC_PRECOS_INDEPENDENTES_COMPARAVEIS',
      precoPraticadoTotal: 1500000.00, // Custo pago à parte relacionada
      precoParametroArmLengthTotal: 1200000.00 // Preço de mercado independente
    });

    const data = unwrap(res);
    expect(data.necessitaAjuste).toBe(true);
    expect(data.valorAjusteFiscalLalurParteA).toBe(300000.00); // 1.5M - 1.2M
    expect(data.impactoTributarioIrpjCsll34Percent).toBe(102000.00); // 34% de 300k
    expect(data.diagnosticoTransferPricing).toContain("Princípio Arm's Length");
  });
});
