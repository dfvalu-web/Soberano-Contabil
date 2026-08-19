import { describe, it, expect } from 'vitest';
import {
  processOfficeTaskKanbanEngine,
  processOfficeTeamProductivitySlaEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Tarefas, Produtividade & SLAs da Equipe do Escritório', () => {
  it('1. Deve atualizar o quadro Kanban departamental e calcular taxa de conclusao de tarefas', () => {
    const resKanban = processOfficeTaskKanbanEngine({
      escritorioNome: 'Soberano Contabilidade Global',
      mesCompetencia: '2026-08',
      tarefas: [
        {
          tarefaId: 'TSK-001',
          titulo: 'Fechamento Contábil e Conciliação OFX',
          departamento: 'CONTABIL',
          clienteCnpj: '11.111.111/0001-11',
          responsavelNome: 'Carlos Eduardo',
          dataLimiteLegal: '2026-08-15',
          status: 'CONCLUIDO'
        },
        {
          tarefaId: 'TSK-002',
          titulo: 'Apuração do Simples Nacional PGDAS-D',
          departamento: 'FISCAL',
          clienteCnpj: '22.222.222/0001-22',
          responsavelNome: 'Mariana Souza',
          dataLimiteLegal: '2026-08-20',
          status: 'CONCLUIDO'
        },
        {
          tarefaId: 'TSK-003',
          titulo: 'Transmissão eSocial S-1200 Folha de Pagamento',
          departamento: 'DEPARTAMENTO_PESSOAL',
          clienteCnpj: '33.333.333/0001-33',
          responsavelNome: 'Lucas Mendes',
          dataLimiteLegal: '2026-08-15',
          status: 'EM_ANDAMENTO'
        }
      ]
    });

    const dataKanban = unwrap(resKanban);
    expect(dataKanban.totalTarefas).toBe(3);
    expect(dataKanban.tarefasConcluidas).toBe(2);
    expect(dataKanban.tarefasEmAndamento).toBe(1);
    expect(dataKanban.taxaConclusaoPercent).toBe(66.7);
    expect(dataKanban.statusQuadro).toBe('KANBAN_ESCRITORIO_ATUALIZADO_SUCESSO');
    expect(dataKanban.diagnosticoQuadro).toContain('Concluidas: 2 (66.7%)');
  });

  it('2. Deve avaliar indice de SLA geral do escritorio e destacar colaborador de melhor performance', () => {
    const resProd = processOfficeTeamProductivitySlaEngine({
      escritorioNome: 'Soberano Contabilidade Global',
      mesReferencia: '2026-08',
      equipe: [
        {
          colaboradorId: 'COL-001',
          colaboradorNome: 'Carlos Eduardo',
          departamento: 'Contábil',
          totalTarefasAtribuidas: 40,
          tarefasEntreguesNoPrazo: 40,
          tarefasAtrasadas: 0,
          tempoMedioExecucaoHoras: 1.5
        },
        {
          colaboradorId: 'COL-002',
          colaboradorNome: 'Mariana Souza',
          departamento: 'Fiscal',
          totalTarefasAtribuidas: 50,
          tarefasEntreguesNoPrazo: 49,
          tarefasAtrasadas: 1,
          tempoMedioExecucaoHoras: 1.2
        }
      ]
    });

    const dataProd = unwrap(resProd);
    expect(dataProd.totalColaboradoresAvaliados).toBe(2);
    expect(dataProd.indiceSlaGeralEscritorioPercent).toBe(98.9); // 89/90 = 98.88%
    expect(dataProd.colaboradorDestaqueNome).toBe('Carlos Eduardo');
    expect(dataProd.statusSla).toBe('SLA_EXCELENTE_ACIMA_DA_META');
    expect(dataProd.diagnosticoProductividade).toContain('Carlos Eduardo (100.0% no prazo)');
  });
});
