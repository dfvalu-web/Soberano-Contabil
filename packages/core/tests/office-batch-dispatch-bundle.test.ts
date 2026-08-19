import { describe, it, expect } from 'vitest';
import {
  processOfficeBatchDispatchBundleEngine,
  processOfficeDeliveryProtocolAuditEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Disparo em Lote 1-Click de Pacotes de Fechamento (Fase 2)', () => {
  it('1. Deve montar e disparar pacote em lote para 2 clientes com Pix Copia e Cola', () => {
    const resDispatch = processOfficeBatchDispatchBundleEngine({
      escritorioNome: 'Soberano Contabilidade & Consultoria',
      competenciaMesAno: '2026-08',
      clientesParaDisparo: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Comércio Varejista Alpha Ltda',
          contatoEmail: 'financeiro@alpha.com.br',
          contatoWhatsapp: '+5511999990001',
          valorGuiaPrincipalBrl: 15400.00,
          tipoGuiaPrincipal: 'DAS_SIMPLES',
          totalHoleritesCount: 12,
          gerarPixCopiaECola: true
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Indústria Beta S/A',
          contatoEmail: 'tributario@beta.com.br',
          contatoWhatsapp: '+5511999990002',
          valorGuiaPrincipalBrl: 45000.00,
          tipoGuiaPrincipal: 'DARF_DCTFWEB',
          totalHoleritesCount: 45,
          gerarPixCopiaECola: true
        }
      ]
    });

    const dataDispatch = unwrap(resDispatch);
    expect(dataDispatch.totalEmpresasDisparadasCount).toBe(2);
    expect(dataDispatch.totalValorGuiasDisparadasBrl).toBe(60400.00);
    expect(dataDispatch.totalHoleritesEnviadosCount).toBe(57);
    expect(dataDispatch.detalhesDisparo[0].codigoPixGerado).toContain('BR.GOV.BCB.PIX');
    expect(dataDispatch.detalhesDisparo[0].canaisDisparados).toContain('WHATSAPP_BUSINESS_API');
    expect(dataDispatch.statusLote).toBe('DISPARO_EM_LOTE_1CLICK_CONCLUIDO');
    expect(dataDispatch.diagnosticoDisparo).toContain('Disparo em Lote 1-Click');
  });

  it('2. Deve gerar protocolo digital blindado com hash SHA-256 e validade juridica contra multas', () => {
    const resProt = processOfficeDeliveryProtocolAuditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio Varejista Alpha Ltda',
      competenciaMesAno: '2026-08',
      valorGuiaBrl: 15400.00,
      timestampDisparoUtc: '2026-08-18T03:38:00Z'
    });

    const dataProt = unwrap(resProt);
    expect(dataProt.protocoloTransmissaoId).toContain('PROT_202608_11111111');
    expect(dataProt.hashCriptograficoSha256).toContain('SHA256_');
    expect(dataProt.validadeJuridicaStatus).toBe('COMPROVANTE_TEMPORAL_BLINDADO');
    expect(dataProt.statusProtocolo).toBe('PROTOCOLO_DE_ENTREGA_GERADO');
    expect(dataProt.diagnosticoProtocolo).toContain('Protocolo de Entrega Digital');
  });
});
