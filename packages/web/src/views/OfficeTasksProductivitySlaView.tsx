import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  User,
  Zap,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const OfficeTasksProductivitySlaView: React.FC = () => {
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Conciliar Extrato Itaú 08/2026 - Soberano Tech S/A', dept: 'Contábil', resp: 'Carlos Silva', prazo: 'Hoje às 17:00', slaStatus: 'NO_PRAZO', status: 'EM_ANDAMENTO' },
    { id: 2, title: 'Calcular Rescisão Trabalhista CLT - Drogaria Alvorada', dept: 'DP', resp: 'Mariana Santos', prazo: 'Amanhã às 12:00', slaStatus: 'NO_PRAZO', status: 'PENDENTE' },
    { id: 3, title: 'Apurar PGDAS-D & Emitir Guia Pix - Alpha Consult', dept: 'Fiscal', resp: 'Roberto Lima', prazo: 'Hoje às 18:00', slaStatus: 'RISCO', status: 'EM_ANDAMENTO' },
    { id: 4, title: 'Renovar Certidão Negativa Municipal (ISS) - Indústria Metalúrgica', dept: 'Societário', resp: 'Fernanda Rocha', prazo: 'Em 3 dias', slaStatus: 'NO_PRAZO', status: 'CONCLUIDO' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDept, setNewTaskDept] = useState('Contábil');
  const [newTaskResp, setNewTaskResp] = useState('Carlos Silva');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      dept: newTaskDept,
      resp: newTaskResp,
      prazo: 'Em 2 dias',
      slaStatus: 'NO_PRAZO',
      status: 'PENDENTE'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    showToast('Nova tarefa operacional cadastrada com SLA ativo!');
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'CONCLUIDO' ? 'PENDENTE' : 'CONCLUIDO' } : t));
    showToast('Status da tarefa atualizado com recálculo de produtividade!');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchDept = filterDept === 'ALL' || t.dept === filterDept;
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchDept && matchStatus;
    });
  }, [tasks, filterDept, filterStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          border: '1.5px solid #34D399',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6), 0 0 15px rgba(52, 211, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} color="#34D399" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Executivo 3D 4K */}
      <div style={{
        background: 'linear-gradient(180deg, #18263D 0%, #0E1626 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderBottom: '3px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1.5px solid #34D399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)'
          }}>
            📋
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Tarefas, Produtividade & SLAs da Equipe
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                SLAS EM TEMPO REAL
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Painel operacional de distribuição de demandas, monitoramento de prazos e controle de produtividade por especialista.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Criação Rápida de Tarefas */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <input
          type="text"
          placeholder="Descreva a nova tarefa operacional..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{
            flex: 1,
            minWidth: '220px',
            background: '#0B1120',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '0.80rem',
            outline: 'none'
          }}
        />
        <select
          value={newTaskDept}
          onChange={(e) => setNewTaskDept(e.target.value)}
          style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', outline: 'none' }}
        >
          <option value="Contábil">Pilar Contábil</option>
          <option value="Fiscal">Pilar Fiscal</option>
          <option value="DP">Pilar DP</option>
          <option value="Societário">Pilar Societário</option>
        </select>
        <select
          value={newTaskResp}
          onChange={(e) => setNewTaskResp(e.target.value)}
          style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#34D399', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', outline: 'none' }}
        >
          <option value="Carlos Silva">Carlos Silva</option>
          <option value="Mariana Santos">Mariana Santos</option>
          <option value="Roberto Lima">Roberto Lima</option>
          <option value="Fernanda Rocha">Fernanda Rocha</option>
        </select>
        <button
          onClick={handleAddTask}
          className="btn-1click-3d"
        >
          <Plus size={14} /> <span>Adicionar Tarefa</span>
        </button>
      </div>

      {/* Grade de Tarefas Filtrável */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
            Demandas Operacionais Ativas ({filteredTasks.length} tarefas)
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94A3B8', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem' }}
            >
              <option value="ALL">Todos os Departamentos</option>
              <option value="Contábil">Contábil</option>
              <option value="Fiscal">Fiscal</option>
              <option value="DP">DP</option>
              <option value="Societário">Societário</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94A3B8', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem' }}
            >
              <option value="ALL">Todos os Status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluídas</option>
            </select>
          </div>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Tarefa Operacional</th>
              <th style={{ textAlign: 'center' }}>Departamento</th>
              <th style={{ textAlign: 'center' }}>Responsável</th>
              <th style={{ textAlign: 'center' }}>Prazo / SLA</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{t.title}</td>
                <td style={{ textAlign: 'center', color: '#38BDF8', fontWeight: 800 }}>{t.dept}</td>
                <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.72rem' }}>{t.resp}</td>
                <td style={{ textAlign: 'center', fontSize: '0.70rem', color: t.slaStatus === 'RISCO' ? '#F87171' : '#34D399', fontWeight: 700 }}>
                  {t.prazo}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: t.status === 'CONCLUIDO' ? 'rgba(16, 185, 129, 0.2)' : t.status === 'EM_ANDAMENTO' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: t.status === 'CONCLUIDO' ? '#34D399' : t.status === 'EM_ANDAMENTO' ? '#38BDF8' : '#FBBF24'
                  }}>
                    {t.status === 'CONCLUIDO' ? '✓ Concluída' : t.status === 'EM_ANDAMENTO' ? '⚡ Em Andamento' : '⏳ Pendente'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleTask(t.id)}
                    style={{
                      background: t.status === 'CONCLUIDO' ? '#0B1120' : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                      border: t.status === 'CONCLUIDO' ? '1px solid rgba(255,255,255,0.15)' : '1px solid #34D399',
                      color: t.status === 'CONCLUIDO' ? '#94A3B8' : '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {t.status === 'CONCLUIDO' ? 'Reabrir' : 'Concluir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficeTasksProductivitySlaView;
