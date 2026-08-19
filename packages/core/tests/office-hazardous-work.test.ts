import { describe, it, expect } from 'vitest';
import {
  processOfficeHazardousWorkPayrollEngine,
  processOfficeLtcatEsocialWorkplaceHazardEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Insalubridade (NR-15), Periculosidade (NR-16) & LTCAT eSocial S-2240', () => {
  it('1. Deve calcular adicional de periculosidade de 30% sobre salario base de R$ 4.000,00 e reflexos em FGTS e INSS', () => {
    const resHaz = processOfficeHazardousWorkPayrollEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Carlos Eduardo Mendes',
      salarioBaseBrl: 4000.00,
      salarioMinimoNacionalBrl: 1518.00,
      tipoAdicional: 'PERICULOSIDADE_30'
    });

    const dataHaz = unwrap(resHaz);
    expect(dataHaz.baseCalculoUtilizadaBrl).toBe(4000.00);
    expect(dataHaz.aliquotaAdicionalPercent).toBe(30.0);
    expect(dataHaz.valorAdicionalMensalBrl).toBe(1200.00); // 30% de 4000
    expect(dataHaz.reflexoFgts8PercentBrl).toBe(96.00); // 8% de 1200
    expect(dataHaz.reflexoInssPatronal20PercentBrl).toBe(240.00); // 20% de 1200
    expect(dataHaz.remuneracaoTotalComAdicionalBrl).toBe(5200.00); // 4000 + 1200
    expect(dataHaz.rubricaEsocialUtilizada).toBe('1030_ADICIONAL_PERICULOSIDADE');
    expect(dataHaz.statusApuracao).toBe('ADICIONAL_TRABALHISTA_APURADO_COM_SUCESSO');
    expect(dataHaz.diagnosticoAdicional).toContain('PERICULOSIDADE_30');
  });

  it('2. Deve vincular laudo LTCAT com agente nocivo e gerar evento eSocial S-2240 e partidas dobradas', () => {
    const resSst = processOfficeLtcatEsocialWorkplaceHazardEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Carlos Eduardo Mendes',
      setorTrabalho: 'Operações Industriais',
      cargoFuncao: 'Operador de Caldeira',
      codigoAgenteNocivoTabela24: '03.01.001',
      descricaoAgenteNocivo: 'Inflamáveis e Combustíveis Gasosos',
      medicoEngenheiroResponsavelLTCAT: 'Eng. Marcelo Silveira (CREA 98765-SP)',
      valorTotalProvisaoFolhaBrl: 5200.00
    });

    const dataSst = unwrap(resSst);
    expect(dataSst.eventoEsocialSst).toBe('S-2240_CONDICOES_AMBIENTAIS_DO_TRABALHO');
    expect(dataSst.gerouPppEletronico).toBe(true);
    expect(dataSst.partidaDobradaProvisaoCusto).toContain('4.1.01.005 Despesas com Salários e Adicionais');
    expect(dataSst.statusSst).toBe('LTCAT_VINCULADO_E_EVENTO_S2240_CONCLUIDO');
    expect(dataSst.diagnosticoSst).toContain('PPP Eletrônico alimentado');
  });
});
