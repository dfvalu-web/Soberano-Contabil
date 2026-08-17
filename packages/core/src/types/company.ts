export type TaxRegime = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL_TRIMESTRAL' | 'LUCRO_REAL_ANUAL';

export interface Company {
  id: string;
  tenantId: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  cnaePrincipal: string;
  cnaesSecundarios: string[];
  regimeTributario: TaxRegime;
  uf: string;
  codigoMunicipioIbge: string;
  aliquotaIssMunicipal: number; // e.g. 0.05 (5%)
  fatorRElegivel: boolean;
  optanteSimples: boolean;
  createdAt: Date;
  updatedAt: Date;
}
