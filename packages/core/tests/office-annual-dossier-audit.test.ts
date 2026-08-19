import { describe, it, expect } from 'vitest';
import {
  processOfficeClientManagementRepresentationLetterEngine,
  processOfficeAuditOpinionSocialBalanceEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Dossiê Anual, Carta da Administração (NBC TA 580) & Parecer de Auditoria', () => {
  it('1. Deve emitir Carta de Responsabilidade da Administracao conforme NBC TA 580 com blindagem do contador', () => {
    const resLetter = processOfficeClientManagementRepresentationLetterEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Distribuição de Alimentos Paulista S/A',
      anoExercicio: 2025,
      administradorNome: 'Roberto Alencar Gomes',
      administradorCpf: '123.456.789-00',
      administradorCargo: 'Diretor Presidente',
      contadorResponsavelNome: 'Soberano Contábil Auditoria',
      contadorResponsavelCrc: 'CRC-SP 012.345/O-9',
      declaraAusenciaFraudesNaoInformadas: true
    });

    const dataLetter = unwrap(resLetter);
    expect(dataLetter.cartaEmitidaPdf).toBe(true);
    expect(dataLetter.blindagemContadorAtiva).toBe(true);
    expect(dataLetter.amparoNbcTa580).toBe(true);
    expect(dataLetter.cartaTextoFormatado).toContain('NBC TA 580 / RESOLUÇÃO CFC Nº 1.457/13');
    expect(dataLetter.cartaTextoFormatado).toContain('Roberto Alencar Gomes');
    expect(dataLetter.statusCarta).toBe('CARTA_RESPONSABILIDADE_ADMINISTRACAO_VALIDADA');
    expect(dataLetter.diagnosticoCarta).toContain('Blindagem jurídica do contador');
  });

  it('2. Deve emitir Parecer de Auditoria (NBC TA 700) e Balanço Social consolidado', () => {
    const resAudit = processOfficeAuditOpinionSocialBalanceEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Indústria Química Horizonte Ltda',
      anoExercicio: 2025,
      totalReceitaBrutaBrl: 10000000.00,
      totalTributosRecolhidosBrl: 2200000.00,
      totalFolhaSalariosEncargosBrl: 3500000.00,
      investimentosSociaisTreinamentoBrl: 150000.00,
      tipoOpiniaoAuditoria: 'SEM_RESSALVAS_OPINIAO_LIMPA',
      auditorResponsavelNome: 'Eduardo Martins Costa',
      auditorResponsavelCna: 'CNA 12.345'
    });

    const dataAudit = unwrap(resAudit);
    expect(dataAudit.tipoOpiniaoAuditoria).toBe('SEM_RESSALVAS_OPINIAO_LIMPA');
    expect(dataAudit.balancoSocialDvaPercentualTributos).toBe(22.0); // 2.2M / 10M
    expect(dataAudit.balancoSocialDvaPercentualFolha).toBe(35.0); // 3.5M / 10M
    expect(dataAudit.relatorioAuditoriaTextoFormatado).toContain('NBC TA 700');
    expect(dataAudit.relatorioAuditoriaTextoFormatado).toContain('SEM_RESSALVAS_OPINIAO_LIMPA');
    expect(dataAudit.statusParecer).toBe('PARECER_AUDITORIA_E_BALANCO_SOCIAL_EMITIDOS');
    expect(dataAudit.diagnosticoParecer).toContain('Balanço Social: R$ 2.200.000,00');
  });
});
