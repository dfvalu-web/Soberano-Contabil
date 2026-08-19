import { describe, it, expect } from 'vitest';
import {
  processOfficeEcdSpedGenerationEngine,
  processOfficeJuntaComercialRegistryEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Escrituração Digital (ECD/ECF) & Registro na Junta Comercial', () => {
  it('1. Deve gerar arquivo SPED ECD com Termos I030, Balanco J100 e DRE J150 amarrados', () => {
    const resEcd = processOfficeEcdSpedGenerationEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Indústria e Comércio de Máquinas Paulistana S/A',
      nireJuntaComercial: '35300123456',
      anoExercicio: 2025,
      livroTipo: 'LIVRO_DIARIO_GERAL_G',
      ativoTotalBrl: 1500000.00,
      passivoTotalBrl: 600000.00,
      patrimonioLiquidoBrl: 900000.00,
      lucroLiquidoExercicioBrl: 250000.00,
      contadorNome: 'Marcio Silva Santos',
      contadorCrc: 'CRC-SP 234.567/O-8'
    });

    const dataEcd = unwrap(resEcd);
    expect(dataEcd.arquivoSpedEcdGerado).toBe(true);
    expect(dataEcd.totalLinhasSped).toBeGreaterThan(1000);
    expect(dataEcd.termoAberturaRegistroI030).toContain('TERMO DE ABERTURA');
    expect(dataEcd.termoAberturaRegistroI030).toContain('35300123456');
    expect(dataEcd.termoEncerramentoRegistroI030).toContain('TERMO DE ENCERRAMENTO');
    expect(dataEcd.demonstrativoBalançoRegistroJ100).toContain('|J100|1|ATIVO TOTAL|1500000.00|D|');
    expect(dataEcd.demonstrativoDreRegistroJ150).toContain('|J150|1|RESULTADO DO EXERCICIO|250000.00|C|');
    expect(dataEcd.statusEcd).toBe('ECD_VALIDADA_SEM_ERROS_PRONTA_TRANSMISSAO');
    expect(dataEcd.diagnosticoEcd).toContain('Balanço J100: R$ 1.500.000,00');
  });

  it('2. Deve autenticar e registrar Livro Diario na Junta Comercial conforme Decreto 8.683/16', () => {
    const resJunta = processOfficeJuntaComercialRegistryEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Comércio de Ferragens Brasil Central Ltda',
      nireJuntaComercial: '35200987654',
      anoExercicio: 2025,
      numeroReciboEntregaSped: '9F.8E.7D.6C.5B.4A.32.10',
      hashAutenticacaoSped: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    });

    const dataJunta = unwrap(resJunta);
    expect(dataJunta.autenticacaoJuntaDigitalConcluida).toBe(true);
    expect(dataJunta.amparadoDecreto8683).toBe(true);
    expect(dataJunta.termoAutenticacaoDreiNumero).toContain('AUT-DREI-2025-');
    expect(dataJunta.statusRegistro).toBe('LIVRO_CONTABIL_REGISTRADO_E_AUTENTICADO_NA_JUNTA');
    expect(dataJunta.diagnosticoJunta).toContain('Decreto nº 8.683/16');
  });
});
