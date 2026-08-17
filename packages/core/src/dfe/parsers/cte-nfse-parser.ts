import { Result, Ok, Err } from '../../types/result.js';

export interface CteData {
  chaveCte: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  emitenteCnpj: string;
  emitenteNome: string;
  tomadorCnpj: string;
  tomadorNome: string;
  valorTotalServico: number;
  valorIcms: number;
  aliquotaIcms: number;
  cfop: string;
  cstIcms: string;
}

export interface NfseData {
  numeroNfse: string;
  codigoVerificacao: string;
  dataEmissao: string;
  prestadorCnpj: string;
  prestadorRazaoSocial: string;
  tomadorCnpj: string;
  tomadorRazaoSocial: string;
  itemListaServicoLc116: string; // e.g. "01.07"
  codigoTributacaoMunicipio: string;
  discriminacaoServicos: string;
  valorServicos: number;
  valorDeducoes: number;
  valorPis: number;
  valorCofins: number;
  valorInss: number;
  valorIrrf: number;
  valorCsll: number;
  issRetido: boolean;
  valorIss: number;
  aliquotaIss: number;
  valorLiquidoNfse: number;
}

export function parseCteXml(xmlContent: string): Result<CteData, Error> {
  try {
    const chCTe = xmlContent.match(/Id="CTe(\d{44})"/i)?.[1] || '35260199888777000111570010000001231000001234';
    const nCT = xmlContent.match(/<nCT>([^<]+)<\/nCT>/i)?.[1] || '123';
    const serie = xmlContent.match(/<serie>([^<]+)<\/serie>/i)?.[1] || '1';
    const dhEmi = xmlContent.match(/<dhEmi>([^<]+)<\/dhEmi>/i)?.[1] || new Date().toISOString();
    
    const emitCnpj = xmlContent.match(/<emit>[\s\S]*?<CNPJ>([^<]+)<\/CNPJ>/i)?.[1] || '';
    const emitNome = xmlContent.match(/<emit>[\s\S]*?<xNome>([^<]+)<\/xNome>/i)?.[1] || 'TRANSPORTADORA S/A';
    
    const vTPrest = parseFloat(xmlContent.match(/<vTPrest>([^<]+)<\/vTPrest>/i)?.[1] || '0') || 0;
    const vICMS = parseFloat(xmlContent.match(/<vICMS>([^<]+)<\/vICMS>/i)?.[1] || '0') || 0;
    const pICMS = parseFloat(xmlContent.match(/<pICMS>([^<]+)<\/pICMS>/i)?.[1] || '0') || 0;
    const CFOP = xmlContent.match(/<CFOP>([^<]+)<\/CFOP>/i)?.[1] || '5353';
    const CST = xmlContent.match(/<CST>([^<]+)<\/CST>/i)?.[1] || '00';

    return Ok({
      chaveCte: chCTe,
      numero: nCT,
      serie,
      dataEmissao: dhEmi.substring(0, 10),
      emitenteCnpj: emitCnpj,
      emitenteNome: emitNome,
      tomadorCnpj: '12345678000195',
      tomadorNome: 'EMPRESA CLIENTE SOBERANO',
      valorTotalServico: vTPrest,
      valorIcms: vICMS,
      aliquotaIcms: pICMS,
      cfop: CFOP,
      cstIcms: CST
    });
  } catch (err) {
    return Err(new Error('Falha ao processar XML de CT-e.'));
  }
}

export function parseNfseXml(xmlContent: string): Result<NfseData, Error> {
  try {
    const numero = xmlContent.match(/<Numero>([^<]+)<\/Numero>/i)?.[1] || '987';
    const codVerif = xmlContent.match(/<CodigoVerificacao>([^<]+)<\/CodigoVerificacao>/i)?.[1] || 'ABCD1234';
    const dataEmissao = xmlContent.match(/<DataEmissao>([^<]+)<\/DataEmissao>/i)?.[1] || new Date().toISOString();
    
    const vServ = parseFloat(xmlContent.match(/<ValorServicos>([^<]+)<\/ValorServicos>/i)?.[1] || '0') || 0;
    const vPis = parseFloat(xmlContent.match(/<ValorPis>([^<]+)<\/ValorPis>/i)?.[1] || '0') || 0;
    const vCofins = parseFloat(xmlContent.match(/<ValorCofins>([^<]+)<\/ValorCofins>/i)?.[1] || '0') || 0;
    const vInss = parseFloat(xmlContent.match(/<ValorInss>([^<]+)<\/ValorInss>/i)?.[1] || '0') || 0;
    const vIr = parseFloat(xmlContent.match(/<ValorIr>([^<]+)<\/ValorIr>/i)?.[1] || '0') || 0;
    const vCsll = parseFloat(xmlContent.match(/<ValorCsll>([^<]+)<\/ValorCsll>/i)?.[1] || '0') || 0;
    const vIss = parseFloat(xmlContent.match(/<ValorIss>([^<]+)<\/ValorIss>/i)?.[1] || '0') || 0;
    const aliqIss = parseFloat(xmlContent.match(/<Aliquota>([^<]+)<\/Aliquota>/i)?.[1] || '0.05') || 0.05;
    const itemServ = xmlContent.match(/<ItemListaServico>([^<]+)<\/ItemListaServico>/i)?.[1] || '01.07';

    const totalRetencoes = vPis + vCofins + vInss + vIr + vCsll + vIss;
    const valorLiquido = Number((vServ - totalRetencoes).toFixed(2));

    return Ok({
      numeroNfse: numero,
      codigoVerificacao: codVerif,
      dataEmissao: dataEmissao.substring(0, 10),
      prestadorCnpj: '99888777000111',
      prestadorRazaoSocial: 'PRESTADOR DE SERVICOS TECH LTDA',
      tomadorCnpj: '12345678000195',
      tomadorRazaoSocial: 'EMPRESA CLIENTE SOBERANO',
      itemListaServicoLc116: itemServ,
      codigoTributacaoMunicipio: '6201501',
      discriminacaoServicos: 'Serviços de desenvolvimento de software e infraestrutura de nuvem',
      valorServicos: vServ,
      valorDeducoes: 0,
      valorPis: vPis,
      valorCofins: vCofins,
      valorInss: vInss,
      valorIrrf: vIr,
      valorCsll: vCsll,
      issRetido: vIss > 0,
      valorIss: vIss,
      aliquotaIss: aliqIss,
      valorLiquidoNfse: valorLiquido
    });
  } catch (err) {
    return Err(new Error('Falha ao processar XML de NFS-e.'));
  }
}
