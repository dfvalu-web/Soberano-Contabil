import { describe, it, expect } from 'vitest';
import {
  processOfficeRedesimAddressViabilityEngine,
  processOfficeLicensingFireSanitaryRiskEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Viabilidade Redesim & Licenciamento Integrado (Lei 13.874/19)', () => {
  it('1. Deve emitir protocolo de viabilidade Redesim com aprovacao de nome e zoneamento', () => {
    const resViab = processOfficeRedesimAddressViabilityEngine({
      nomeEmpresarialSugerido: 'Inovação em Sistemas Digitais Paulista Ltda',
      uf: 'SP',
      municipioIbge: '3550308',
      inscricaoImobiliariaIptu: '045.123.4567-8',
      cnaePrincipal: '6201-5/01',
      cnaesSecundarios: ['6202-3/00', '6311-9/00'],
      areaOcupadaM2: 120
    });

    const dataViab = unwrap(resViab);
    expect(dataViab.viabilidadeNomeAprovada).toBe(true);
    expect(dataViab.viabilidadeEnderecoAprovada).toBe(true);
    expect(dataViab.protocoloViabilidadeRedesim).toContain('SPV');
    expect(dataViab.statusZoneamentoUrbano).toBe('PERMITIDO_SEM_RESTRICOES');
    expect(dataViab.statusViabilidade).toBe('VIABILIDADE_REDESIM_APROVADA_PRONTA_DBE');
    expect(dataViab.diagnosticoViabilidade).toContain('DBE Coleta Web');
  });

  it('2. Deve classificar risco de licenciamento e aplicar dispensa de alvara pela Lei da Liberdade Economica', () => {
    const resRisk = processOfficeLicensingFireSanitaryRiskEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Consultoria Financeira Aliança Ltda',
      cnaePrincipal: '7020-4/00',
      grauRiscoAtividade: 'NIVEL_I_LEVE_BAIXO_RISCO',
      possuiAtendimentoPublico: false,
      areaEdificadaM2: 80
    });

    const dataRisk = unwrap(resRisk);
    expect(dataRisk.dispensaAlvaraLeiLiberdadeEconomica13874).toBe(true);
    expect(dataRisk.exigeAvcbVistoriaPreviaBombeiros).toBe(false);
    expect(dataRisk.tipoLicencaBombeiros).toBe('CLCB_SIMPLIFICADO');
    expect(dataRisk.statusLicenciamento).toBe('LICENCIAMENTO_INTEGRADO_CONCLUIDO');
    expect(dataRisk.diagnosticoLicenciamento).toContain('Lei 13.874/19');
  });
});
