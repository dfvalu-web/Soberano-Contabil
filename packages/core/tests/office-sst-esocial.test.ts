import { describe, it, expect } from 'vitest';
import {
  processOfficeSstEsocialComplianceEngine,
  processOfficePppElectronicWorkEnvironmentEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Segurança e Saúde no Trabalho (SST) & PPP Digital', () => {
  it('1. Deve validar conformidade de eventos S-2220 (ASO) e S-2240 (LTCAT) com 100% de cobertura', () => {
    const resSst = processOfficeSstEsocialComplianceEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Metalúrgica e Usinagem Moderna S/A',
      totalTrabalhadoresAtivos: 25,
      examesAsoRealizados: [
        {
          cpfColaborador: '111.111.111-11',
          nomeColaborador: 'Marcos Soldador',
          tipoExameAso: 'PERIODICO',
          dataRealizacaoExame: '2026-08-01',
          crmMedicoExaminador: '123456',
          ufCrm: 'SP',
          parecerAptidao: 'APTO'
        }
      ],
      houveAcidentesCatS2210: false,
      totalLaudosLtcatS2240Transmitidos: 25
    });

    const dataSst = unwrap(resSst);
    expect(dataSst.totalAsosValidadosS2220).toBe(1);
    expect(dataSst.totalLtcatsValidadosS2240).toBe(25);
    expect(dataSst.percentualCoberturaSstPercent).toBe(100.0);
    expect(dataSst.eventoS2210Gerado).toBe(false);
    expect(dataSst.statusSst).toBe('SST_ESOCIAL_100_CONFORME_SEM_MULTAS');
    expect(dataSst.diagnosticoSst).toContain('100% blindada contra multas');
  });

  it('2. Deve mapear fatores de risco da Tabela 24 do eSocial e emitir PPP digital conforme o INSS', () => {
    const resPpp = processOfficePppElectronicWorkEnvironmentEngine({
      cpfColaborador: '222.222.222-22',
      nomeColaborador: 'João Mecânico de Manutenção',
      cargoFuncao: 'Mecânico Industrial Pleno',
      setorAmbienteTrabalho: 'Oficina de Motores',
      dataAdmissao: '2024-03-01',
      fatoresRisco: [
        {
          codigoTabela24Esocial: '01.01.001',
          descricaoAgenteNocivo: 'Ruído Contínuo ou Intermitente',
          intensidadeConcentracao: '82 dB(A)',
          limiteTolerancia: '85 dB(A)',
          tipoFatorRisco: 'FISICO',
          epiEficazUtilizado: true,
          epcUtilizado: true
        }
      ],
      direitoAposentadoriaEspecial: false
    });

    const dataPpp = unwrap(resPpp);
    expect(dataPpp.totalAgentesNocivosMapeados).toBe(1);
    expect(dataPpp.codigoGfipAposentadoriaEspecial).toBe('00_SEM_EXPOSICAO');
    expect(dataPpp.pppEletronicoGerado).toBe(true);
    expect(dataPpp.statusPpp).toBe('PPP_ELETRONICO_GERADO_CONFORME_INSS_E_ESOCIAL');
    expect(dataPpp.diagnosticoPpp).toContain('Perfil Profissiográfico Previdenciário');
  });
});
