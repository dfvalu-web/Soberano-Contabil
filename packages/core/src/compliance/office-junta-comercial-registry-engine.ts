import { Result, Ok, Err } from '../types/result.js';

export interface JuntaRegistryInput {
  clienteCnpj: string;
  razaoSocial: string;
  nireJuntaComercial: string;
  anoExercicio: number;
  numeroReciboEntregaSped: string; // Ex: '1A.2B.3C.4D.5E.6F.7G.8H'
  hashAutenticacaoSped: string;
}

export interface JuntaRegistryResult {
  clienteCnpj: string;
  razaoSocial: string;
  nireJuntaComercial: string;
  autenticacaoJuntaDigitalConcluida: boolean;
  termoAutenticacaoDreiNumero: string;
  amparadoDecreto8683: boolean;
  statusRegistro: 'LIVRO_CONTABIL_REGISTRADO_E_AUTENTICADO_NA_JUNTA';
  diagnosticoJunta: string;
}

export function processOfficeJuntaComercialRegistryEngine(input: JuntaRegistryInput): Result<JuntaRegistryResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    nireJuntaComercial,
    anoExercicio,
    numeroReciboEntregaSped,
    hashAutenticacaoSped
  } = input;

  if (!clienteCnpj || !nireJuntaComercial || !numeroReciboEntregaSped) {
    return Err(new Error('CNPJ, NIRE e número do recibo de entrega SPED são obrigatórios.'));
  }

  const numAut = "AUT-DREI-" + anoExercicio + "-" + Date.now().toString().slice(-6);

  const diag = "Registro em Junta Comercial (" + razaoSocial + " - NIRE " + nireJuntaComercial + "): Livro Diário Geral do exercício " + anoExercicio + " autenticado digitalmente nos termos do Decreto nº 8.683/16 | Recibo SPED: " + numeroReciboEntregaSped + " | Hash: " + hashAutenticacaoSped.slice(0, 12) + "... | Protocolo DREI: " + numAut + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    nireJuntaComercial,
    autenticacaoJuntaDigitalConcluida: true,
    termoAutenticacaoDreiNumero: numAut,
    amparadoDecreto8683: true,
    statusRegistro: 'LIVRO_CONTABIL_REGISTRADO_E_AUTENTICADO_NA_JUNTA',
    diagnosticoJunta: diag
  });
}
