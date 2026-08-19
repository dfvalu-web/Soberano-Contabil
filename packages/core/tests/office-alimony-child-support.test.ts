import { describe, it, expect } from 'vitest';
import {
  processOfficeChildSupportAlimonyPayrollEngine,
  processOfficeAlimonyBeneficiaryEsocialEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Pensão Alimentícia Judicial na Folha & eSocial (Lei 5.478/68 e Lei 9.250/95)', () => {
  it('1. Deve calcular pensao judicial de 30% sobre rendimento liquido descontado de INSS e deduzir da base do IRRF', () => {
    const resAli = processOfficeChildSupportAlimonyPayrollEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Felipe Augusto Rocha',
      processoJudicialNumero: '0012345-67.2026.8.26.0100',
      varaFamiliaComarca: '1ª Vara da Família e Sucessões - SP',
      remuneracaoBrutaBrl: 10000.00,
      descontoInssOficialBrl: 1000.00, // Base líquida = 10000 - 1000 = 9000.00
      tipoCalculoPensao: 'PERCENTUAL_SOBRE_LIQUIDO',
      percentualPensaoPercent: 30.0 // 30% de 9000 = 2700.00
    });

    const dataAli = unwrap(resAli);
    expect(dataAli.baseCalculoPensaoBrl).toBe(9000.00);
    expect(dataAli.valorPensaoAlimenticiaDescontadaBrl).toBe(2700.00);
    expect(dataAli.valorPensaoDedutivelBaseIrrfBrl).toBe(2700.00);
    expect(dataAli.salarioLiquidoFinalTrabalhadorBrl).toBe(6300.00); // 10k - 1k - 2.7k
    expect(dataAli.rubricaEsocialDesconto).toBe('5001_PENSAO_ALIMENTICIA_JUDICIAL');
    expect(dataAli.statusPensao).toBe('PENSAO_ALIMENTICIA_APURADA_COM_SUCESSO');
    expect(dataAli.diagnosticoPensao).toContain('Lei 9.250/95');
  });

  it('2. Deve gerar evento eSocial S-1210 e partidas dobradas de desconto e repasse ao beneficiario no passivo', () => {
    const resBen = processOfficeAlimonyBeneficiaryEsocialEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Felipe Augusto Rocha',
      beneficiarioAlimentandoCpf: '987.654.321-00',
      nomeBeneficiarioAlimentando: 'Gabriel Rocha (Filho Menor)',
      bancoDestinoConta: 'Banco Bradesco S/A (Ag 0123 / CC 45678-9)',
      valorPensaoRepasseBrl: 2700.00
    });

    const dataBen = unwrap(resBen);
    expect(dataBen.eventoEsocial).toBe('S-1210_PAGAMENTO_BENEFICIARIO');
    expect(dataBen.partidaDobradaDescontoFolha).toContain('2.1.03.001 Salários e Ordenados a Pagar');
    expect(dataBen.partidaDobradaDescontoFolha).toContain('2.1.03.005 Pensão Alimentícia Judicial a Repassar');
    expect(dataBen.partidaDobradaRepasseBancario).toContain('1.1.01.002 Banco Conta Movimento');
    expect(dataBen.statusRepasse).toBe('REPASSE_PENSAO_CONCLUIDO_E_ESOCIAL_GERADO');
    expect(dataBen.diagnosticoRepasse).toContain('eSocial S-1210');
  });
});
