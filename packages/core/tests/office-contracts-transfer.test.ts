import { describe, it, expect } from 'vitest';
import {
  processOfficeAccountingContractManagementEngine,
  processOfficeTechnicalResponsibilityTransferEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Contratos de Serviços Contábeis, Reajuste & Transferência CFC', () => {
  it('1. Deve reajustar honorarios mensais por indice acumulado e validar clausulas CFC 1.590 e LGPD', () => {
    const resContrato = processOfficeAccountingContractManagementEngine({
      contratoId: 'CTR-2026-001',
      clienteCnpj: '11.111.111/0001-11',
      razaoSocialCliente: 'Indústria Metalmecânica Alfa Ltda',
      honorarioMensalAtualBrl: 3000.00,
      dataInicioContrato: '2025-08-01',
      indiceReajuste: 'IPCA',
      percentualIndiceAcumulado12m: 5.0, // 5% -> + 150 = 3150
      incluiClausulaLgpd: true,
      incluiEscopoExtraordinario: true
    });

    const dataContrato = unwrap(resContrato);
    expect(dataContrato.honorarioMensalReajustadoBrl).toBe(3150.00);
    expect(dataContrato.valorAcrescimoBrl).toBe(150.00);
    expect(dataContrato.conformidadeCfc1590).toBe(true);
    expect(dataContrato.conformidadeLgpd).toBe(true);
    expect(dataContrato.statusContrato).toBe('CONTRATO_REAJUSTADO_E_CONFORME_CFC_1590');
    expect(dataContrato.diagnosticoContrato).toContain('IPCA');
  });

  it('2. Deve emitir termo de transferencia de responsabilidade tecnica com inventario de acervo', () => {
    const resTransf = processOfficeTechnicalResponsibilityTransferEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocialCliente: 'Comércio e Distribuição Beta S/A',
      contadorAnteriorNome: 'Dr. Roberto Alves',
      contadorAnteriorCrc: 'CRC/SP 111111/O-0',
      novoContadorNome: 'Dr. David Valu',
      novoContadorCrc: 'CRC/SP 222222/O-0',
      dataEfetivacaoTransferencia: '2026-08-15',
      itensInventarioEntregues: [
        'Livro Diário e Razão 2024-2025 assinados',
        'Arquivos SPED Fiscal e EFD-Contribuições',
        'Declarações eSocial e DCTFWeb',
        'Certificado Digital A1 e Senhas de Acesso Gov.br'
      ]
    });

    const dataTransf = unwrap(resTransf);
    expect(dataTransf.totalItensInventariados).toBe(4);
    expect(dataTransf.termoEmitidoComSucesso).toBe(true);
    expect(dataTransf.statusTransferencia).toBe('TRANSFERENCIA_RESPONSABILIDADE_TECNICA_CONCLUIDA');
    expect(dataTransf.diagnosticoTransferencia).toContain('4 itens de acervo contábil e fiscal entregues');
  });
});
