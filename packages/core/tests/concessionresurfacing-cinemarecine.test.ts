import { describe, it, expect } from 'vitest';
import {
  evaluateConcessionResurfacingMaintenanceIcpc01,
  processCinemaRecineCondecineTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Manutenção Periódica em Concessões (ICPC 01/CPC 25) & Cinema RECINE (Lei 12.599/12)', () => {
  it('1. Deve constituir provisao de manutencao/recapeamento proporcional ao trafego na DRE (ICPC 01 R1 & CPC 25)', () => {
    const resResurf = evaluateConcessionResurfacingMaintenanceIcpc01({
      concessaoId: 'ROD-01',
      concessionariaNome: 'Rodovias do Planalto S.A.',
      objetoConcessao: 'Recapeamento Asfáltico Trecho Norte',
      custoEstimadoDesembolsoRecapeamentoBrl: 25000000.00,
      cicloRecapeamentoAnos: 5,
      anoAtualDoCiclo: 1,
      volumeTrafegoEfetivoVeiculosEquivalentes: 2000000,
      volumeTrafegoTotalProjetadoCiclo: 10000000 // 20% desgaste no Ano 1 -> 5M DRE
    });

    const dataResurf = unwrap(resResurf);
    expect(dataResurf.desgasteProporcionalPeriodoPercent).toBe(20.00);
    expect(dataResurf.despesaProvisaoPeriodoDrebBrl).toBe(5000000.00);
    expect(dataResurf.saldoAcumuladoProvisaoPassivoBrl).toBe(5000000.00);
    expect(dataResurf.partidasDobrada.length).toBe(2);
    expect(dataResurf.diagnosticoIcpc01Manutencao).toContain('Vedada a capitalização em Imobilizado');
  });

  it('2. Deve apurar desoneracao RECINE e valor da CONDECINE para o setor cinematografico (Lei 12.599/12 & MP 2.228-1)', () => {
    // 2.1 Exibidor Habilitado no RECINE
    const resCinema = processCinemaRecineCondecineTaxEngine({
      empresaId: 'CINE-01',
      empresaNome: 'Soberano Cinemas Multiplex Ltda',
      atividadeTipo: 'EXIBIDOR_SALAS_CINEMA',
      habilitadaNoRecine: true,
      valorAquisicaoEquipamentosProjecaoDigitalBrl: 10000000.00, // Desoneração PIS/COFINS/IPI/II = 2.425.000
      quantidadeTitulosObrasAudiovisuais: 0
    });

    const dataCinema = unwrap(resCinema);
    expect(dataCinema.isBeneficioRecineAplicavel).toBe(true);
    expect(dataCinema.desoneracaoTributosRecineBrl).toBe(2425000.00);
    expect(dataCinema.diagnosticoFiscal).toContain('RECINE Habilitado: SIM');

    // 2.2 Distribuidora com CONDECINE Título
    const resDistrib = processCinemaRecineCondecineTaxEngine({
      empresaId: 'DIST-01',
      empresaNome: 'Soberano Filmes Distribuição S.A.',
      atividadeTipo: 'DISTRIBUIDOR_TITULOS',
      habilitadaNoRecine: false,
      quantidadeTitulosObrasAudiovisuais: 5 // 5 x 3000 = 15.000 CONDECINE
    });

    const dataDistrib = unwrap(resDistrib);
    expect(dataDistrib.valorCondecineDevidaBrl).toBe(15000.00);
    expect(dataDistrib.totalTributosFederaisDevidosBrl).toBe(15000.00);
  });
});
