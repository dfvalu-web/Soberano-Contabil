import { describe, it, expect } from 'vitest';
import {
  processOfficeCorporateGovernanceAssemblyEngine,
  processOfficeElectronicCorporateBooksEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Governança Societária, Assembleias & Livros Digitais', () => {
  it('1. Deve apurar quorum de instalacao/deliberacao e aprovar contas de administracao conforme DREI 79/81', () => {
    const resGov = processOfficeCorporateGovernanceAssemblyEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Inovação & Empreendimentos Brasil Ltda',
      tipoTipoSocietario: 'SOCIEDADE_LIMITADA',
      anoExercicioAprovado: 2026,
      dataRealizacaoReuniao: '2026-04-28',
      totalQuotasAcoesCapital: 100000,
      listaVotosSocios: [
        {
          socioNome: 'Carlos Alberto Silva',
          socioCpfCnpj: '111.222.333-44',
          quantidadeQuotasAcoes: 60000,
          percentualCapitalSocialPercent: 60.0,
          votoAprovacaoContas: 'FAVORAVEL'
        },
        {
          socioNome: 'Mariana Duarte Souza',
          socioCpfCnpj: '222.333.444-55',
          quantidadeQuotasAcoes: 40000,
          percentualCapitalSocialPercent: 40.0,
          votoAprovacaoContas: 'FAVORAVEL'
        }
      ]
    });

    const dataGov = unwrap(resGov);
    expect(dataGov.quorumInstalacaoPercent).toBe(100.0);
    expect(dataGov.quorumAprovacaoContasPercent).toBe(100.0);
    expect(dataGov.resultadoDeliberacao).toBe('CONTAS_DA_ADMINISTRACAO_APROVADAS');
    expect(dataGov.ataAssinadaDigitalmente).toBe(true);
    expect(dataGov.statusAssembleia).toBe('ASSEMBLEIA_DIGITAL_HOMOLOGADA_DREI79');
    expect(dataGov.diagnosticoAssembleia).toContain('CONTAS_DA_ADMINISTRACAO_APROVADAS');
  });

  it('2. Deve encadernar livros societarios eletronicos gerando hash de autenticacao conforme DREI 82/21', () => {
    const resBooks = processOfficeElectronicCorporateBooksEngine({
      empresaCnpj: '22.222.222/0001-22',
      razaoSocial: 'Comércio e Participações Aliança S/A',
      juntaComercialUf: 'JUCESP',
      livrosEmitidos: [
        {
          tipoLivro: 'LIVRO_ATAS_REUNIOES_SOCIOS',
          numeroLivro: 1,
          totalPaginasEletronicas: 45,
          dataTermoAbertura: '2026-01-01'
        },
        {
          tipoLivro: 'LIVRO_REGISTRO_QUOTAS_ACOES',
          numeroLivro: 1,
          totalPaginasEletronicas: 30,
          dataTermoAbertura: '2026-01-01'
        }
      ]
    });

    const dataBooks = unwrap(resBooks);
    expect(dataBooks.totalLivrosEncadernadosDigitalmente).toBe(2);
    expect(dataBooks.hashAutenticacaoJunta).toContain('DREI82_JUCESP_');
    expect(dataBooks.statusLivros).toBe('LIVROS_SOCIETARIOS_DIGITAIS_DREI82_AUTENTICADOS');
    expect(dataBooks.diagnosticoLivros).toContain('IN DREI 82/2021');
  });
});
