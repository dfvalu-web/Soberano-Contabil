import { describe, it, expect } from 'vitest';
import {
  processOfficeSmartDropzoneTriageEngine,
  processOfficeCfcTechnicalResponsibilityTransferEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Triagem Massiva Dropzone & Governança CFC 1.570/19', () => {
  it('1. Deve triar lote de arquivos separando XMLs (Fiscal), OFXs (Contabil) e Ponto/Atestados (DP)', () => {
    const resTriage = processOfficeSmartDropzoneTriageEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio Varejista Brasil Forte Ltda',
      mesCompetencia: '2026-08',
      arquivosRecebidos: [
        {
          nomeArquivo: 'NFe_35260811111111000111550010000012341000012345.xml',
          extensao: '.xml',
          tamanhoBytes: 15400
        },
        {
          nomeArquivo: 'Extrato_Conta_Corrente_Banco_Brasil_082026.ofx',
          extensao: '.ofx',
          tamanhoBytes: 45000
        },
        {
          nomeArquivo: 'Atestado_Medico_Funcionario_Joao_Silva.pdf',
          extensao: '.pdf',
          tamanhoBytes: 250000
        },
        {
          nomeArquivo: 'Espelho_Ponto_Eletronico_Portaria_671.csv',
          extensao: '.csv',
          tamanhoBytes: 85000
        }
      ]
    });

    const dataTriage = unwrap(resTriage);
    expect(dataTriage.totalArquivosRecebidos).toBe(4);
    expect(dataTriage.totalArquivosFiscalXml).toBe(1);
    expect(dataTriage.totalArquivosContabilOfx).toBe(1);
    expect(dataTriage.totalArquivosPessoalRh).toBe(2);
    expect(dataTriage.triagemConcluidaComSucesso).toBe(true);
    expect(dataTriage.arquivosTriados[0].departamentoDestino).toBe('DEPARTAMENTO_FISCAL');
    expect(dataTriage.arquivosTriados[1].departamentoDestino).toBe('DEPARTAMENTO_CONTABIL');
    expect(dataTriage.arquivosTriados[2].departamentoDestino).toBe('DEPARTAMENTO_PESSOAL_RH');
    expect(dataTriage.statusTriagem).toBe('TRIAGEM_MASSIVA_CONCLUIDA_ROTAS_DEFINIDAS');
    expect(dataTriage.diagnosticoTriagem).toContain('100% roteados');
  });

  it('2. Deve emitir Termo de Transferencia de Responsabilidade Tecnica conforme Resolucao CFC 1.570/19', () => {
    const resCfc = processOfficeCfcTechnicalResponsibilityTransferEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Indústria Metalúrgica Progresso S/A',
      tipoTransferencia: 'ENTRADA_NOVO_CLIENTE',
      contadorAnteriorNome: 'Carlos Eduardo Souza',
      contadorAnteriorCrc: 'CRC-SP 189.432/O-5',
      contadorAssumindoNome: 'Soberano Contábil Auditoria & Consultoria',
      contadorAssumindoCrc: 'CRC-SP 098.765/O-1',
      dataTransferenciaEfetiva: '01/09/2026',
      itensEntreguesChecklist: [
        'Livro Diário Geral 2021 a 2025',
        'Livro Razão Analítico e Balancetes',
        'Arquivos SPED Fiscal (EFD ICMS/IPI) e Contribuições',
        'Recibos de Entrega eSocial e DCTFWeb',
        'Certidões Negativas Federal, Estadual e Municipal'
      ]
    });

    const dataCfc = unwrap(resCfc);
    expect(dataCfc.termoTransferenciaEmitidoPdf).toBe(true);
    expect(dataCfc.totalItensInventariados).toBe(5);
    expect(dataCfc.custodiaPermanente5AnosGarantida).toBe(true);
    expect(dataCfc.carimboTempoIcpBrasilValido).toBe(true);
    expect(dataCfc.termoTextoFormatado).toContain('RESOLUÇÃO CFC Nº 1.570/19');
    expect(dataCfc.termoTextoFormatado).toContain('Indústria Metalúrgica Progresso S/A');
    expect(dataCfc.statusTransferencia).toBe('TERMO_CFC_1570_EMITIDO_COM_VALOR_LEGAL');
    expect(dataCfc.diagnosticoTransferencia).toContain('Timestamp ICP-Brasil ativada');
  });
});
