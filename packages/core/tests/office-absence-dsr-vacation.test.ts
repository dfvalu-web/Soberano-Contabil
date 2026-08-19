import { describe, it, expect } from 'vitest';
import {
  processOfficeUnjustifiedAbsenceDsrPenaltyEngine,
  processOfficeVacationScaleAbsenceImpactEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Faltas Injustificadas, DSR & Escala de Férias (Art. 130 CLT e Lei 605/49)', () => {
  it('1. Deve apurar desconto de 2 dias de faltas + 2 DSRs perdidos e gerar rubricas eSocial 5002 e 5003', () => {
    const resAbs = processOfficeUnjustifiedAbsenceDsrPenaltyEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Rodrigo Medeiros',
      salarioBaseBrl: 3000.00, // Dia = 100.00
      quantidadeDiasFaltasInjustificadas: 2, // 200.00
      quantidadeDsrDescontadosCount: 2 // 200.00
    });

    const dataAbs = unwrap(resAbs);
    expect(dataAbs.valorDiaSalarioBrl).toBe(100.00);
    expect(dataAbs.valorTotalDescontoFaltasBrl).toBe(200.00);
    expect(dataAbs.valorTotalDescontoDsrBrl).toBe(200.00);
    expect(dataAbs.totalDescontosFolhaBrl).toBe(400.00);
    expect(dataAbs.remuneracaoLiquidaDevidaBrl).toBe(2600.00);
    expect(dataAbs.rubricaEsocialFalta).toBe('5002_FALTAS_INJUSTIFICADAS');
    expect(dataAbs.rubricaEsocialDsrDescontado).toBe('5003_DSR_DESCONTADO');
    expect(dataAbs.statusApuracao).toBe('FALTAS_E_DSR_APURADOS_COM_SUCESSO');
    expect(dataAbs.diagnosticoFaltas).toContain('5002/5003');
  });

  it('2. Deve aplicar a tabela do Art. 130 da CLT e reduzir os dias de ferias de 30 para 24 dias (8 faltas no periodo)', () => {
    const resVac = processOfficeVacationScaleAbsenceImpactEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Rodrigo Medeiros',
      periodoAquisitivoInicio: '2025-08-01',
      periodoAquisitivoFim: '2026-07-31',
      totalFaltasInjustificadasPeriodo: 8 // Faixa de 6 a 14 faltas = 24 dias
    });

    const dataVac = unwrap(resVac);
    expect(dataVac.totalFaltasPeriodo).toBe(8);
    expect(dataVac.diasDireitoFeriasClt).toBe(24);
    expect(dataVac.diasPerdidosFeriasCount).toBe(6);
    expect(dataVac.perdeuTotalDireitoFerias).toBe(false);
    expect(dataVac.enquadramentoLegalClt).toContain('Art. 130, II CLT');
    expect(dataVac.statusEscala).toBe('ESCALA_FERIAS_ATUALIZADA_CONFORME_ART_130_CLT');
    expect(dataVac.diagnosticoEscala).toContain('Direito a 24 dias');
  });
});
