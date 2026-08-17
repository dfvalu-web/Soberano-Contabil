import { describe, it, expect } from 'vitest';
import {
  evaluateConcessionFinancialAssetIcpc01,
  processHospitalEquiparationMedicalTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Concessões Ativo Financeiro (ICPC 01 R1 / IFRIC 12) & Equiparação Hospitalar (STJ Tema 217)', () => {
  it('1. Deve reconhecer receita de construcao e constituir ativo financeiro de concessao remunerado por juros efetivos (ICPC 01 R1)', () => {
    const resConc = evaluateConcessionFinancialAssetIcpc01({
      contratoId: 'PPP-RODOVIA-01',
      concessionariaNome: 'Concessionária Rodovias do Sol S.A.',
      poderConcedenteEnte: 'Governo do Estado de São Paulo',
      custoConstrucaoInfraestruturaBrl: 50000000.00,
      margemConstrucaoPercent: 10.0, // Receita Construção = 55M
      taxaEfetivaJurosRemuneracaoAnualPercent: 8.5, // 8.5% a.a. sobre 55M = 4.675M
      prazoOperacaoAnos: 25
    });

    const dataConc = unwrap(resConc);
    expect(dataConc.receitaConstrucaoReconhecidaBrl).toBe(55000000.00);
    expect(dataConc.valorInicialAtivoFinanceiroConcessaoBrl).toBe(55000000.00);
    expect(dataConc.receitaFinanceiraJurosAno1Brl).toBe(4675000.00);
    expect(dataConc.partidasDobradaConstrucao.length).toBe(4);
    expect(dataConc.diagnosticoIcpc01).toContain('Modelo do Ativo Financeiro');
  });

  it('2. Deve aplicar reducao da presuncao de 32% para 8% IRPJ e 12% CSLL para servicos hospitalares elegiveis (STJ Tema 217)', () => {
    // 2.1 Clínica Médica Elegível (Sociedade Empresária + ANVISA + Serviços Cirúrgicos/Diagnósticos)
    const resEleg = processHospitalEquiparationMedicalTaxEngine({
      clinicaId: 'CLIN-01',
      clinicaNome: 'Centro de Diagnósticos e Cirurgias Soberano S.A.',
      atendeNormasAnvisa: true,
      isSociedadeEmpresaria: true,
      servicos: {
        receitaServicosHospitalaresCirurgicosDiagnosticosBrl: 1000000.00, // 8% IRPJ / 12% CSLL
        receitaConsultasMedicasSimplesBrl: 100000.00 // 32% IRPJ / 32% CSLL
      }
    });

    const dataEleg = unwrap(resEleg);
    expect(dataEleg.isEquiparacaoAprovadaSTJ).toBe(true);
    expect(dataEleg.baseCalculoIrpjComEquiparacaoBrl).toBe(112000.00); // 1M*0.08 (80k) + 100k*0.32 (32k) = 112k
    expect(dataEleg.baseCalculoCsllComEquiparacaoBrl).toBe(152000.00); // 1M*0.12 (120k) + 100k*0.32 (32k) = 152k
    expect(dataEleg.economiaTributariaEquiparacaoBrl).toBeGreaterThan(50000.00);
    expect(dataEleg.diagnosticoFiscal).toContain('ELEGÍVEL (Sociedade Empresária + ANVISA)');

    // 2.2 Não Elegível (Consultas ou Sem ANVISA)
    const resNaoEleg = processHospitalEquiparationMedicalTaxEngine({
      clinicaId: 'CLIN-02',
      clinicaNome: 'Consultório Médico Simples Ltda',
      atendeNormasAnvisa: false,
      isSociedadeEmpresaria: false,
      servicos: {
        receitaServicosHospitalaresCirurgicosDiagnosticosBrl: 0,
        receitaConsultasMedicasSimplesBrl: 200000.00
      }
    });

    const dataNaoEleg = unwrap(resNaoEleg);
    expect(dataNaoEleg.isEquiparacaoAprovadaSTJ).toBe(false);
    expect(dataNaoEleg.baseCalculoIrpjComEquiparacaoBrl).toBe(64000.00); // 200k * 32%
    expect(dataNaoEleg.economiaTributariaEquiparacaoBrl).toBe(0);
  });
});
