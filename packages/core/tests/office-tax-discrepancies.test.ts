import { describe, it, expect } from 'vitest';
import {
  processOfficeTaxDiscrepanciesMonitorEngine,
  processOfficeAutomatedTaxNotificationsEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Malhas Fiscais & Disparo Automático de Guias com Pix', () => {
  it('1. Deve cruzar dados da DIMP (cartoes/Pix) com PGDAS e detectar divergencias fiscais', () => {
    const resDisc = processOfficeTaxDiscrepanciesMonitorEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Restaurante e Churrascaria Sabor Paulista Ltda',
      mesCompetencia: '2026-08',
      faturamentoDeclaradoPgdasBrl: 100000.00,
      totalVendasCartaoPixDimpBrl: 140000.00, // Omissão de 40k
      totalEntradasContasBancariasBrl: 150000.00
    });

    const dataDisc = unwrap(resDisc);
    expect(dataDisc.divergenciaDimpBrl).toBe(40000.00);
    expect(dataDisc.riscoMalhaFiscal).toBe('ALTO_RISCO_AUTUACAO_RECEITA_SEFAZ');
    expect(dataDisc.multaEstimadaAutoInfracaoBrl).toBe(3000.00); // 40k * 10% * 75%
    expect(dataDisc.statusAuditoria).toBe('AUDITORIA_PREVENTIVA_MALHA_CONCLUIDA');
    expect(dataDisc.diagnosticoMalha).toContain('Risco: ALTO_RISCO_AUTUACAO_RECEITA_SEFAZ');
  });

  it('2. Deve disparar notificacao de guia via WhatsApp e e-mail com chave Pix Copia e Cola', () => {
    const resNotif = processOfficeAutomatedTaxNotificationsEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Supermercado Progresso Ltda',
      telefoneWhatsappContato: '5511999998888',
      emailContato: 'financeiro@superprogresso.com.br',
      tipoGuia: 'DAS_SIMPLES',
      valorGuiaBrl: 12500.50,
      dataVencimento: '20/09/2026',
      chavePixCopiaECola: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540812500.505802BR5925SUPERMERCADO PROGRESSO6009SAO PAULO62070503***6304ABCD'
    });

    const dataNotif = unwrap(resNotif);
    expect(dataNotif.notificacaoAgendada).toBe(true);
    expect(dataNotif.mensagemWhatsappFormatada).toContain('R$ 12.500,50');
    expect(dataNotif.mensagemWhatsappFormatada).toContain('Pix Copia e Cola');
    expect(dataNotif.protocoloDisparoId).toContain('DISP-');
    expect(dataNotif.statusEnvio).toBe('NOTIFICACAO_DISPARADA_COM_SUCESSO_PIX_ATIVO');
    expect(dataNotif.diagnosticoEnvio).toContain('5511999998888');
  });
});
