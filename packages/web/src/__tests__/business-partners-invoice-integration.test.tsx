import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfficeInvoiceBillingIssuerView, NATURE_OPTIONS } from '../views/OfficeInvoiceBillingIssuerView';
import { OfficeBusinessPartnersRegistryView, INITIAL_PARTNERS } from '../views/OfficeBusinessPartnersRegistryView';

describe('Business Partners Registry & Invoice Issuer Integration Suite', () => {
  it('1. Renderiza o Emissor de Notas Fiscais com o seletor inteligente de Natureza de Operação', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeInvoiceBillingIssuerView));

    expect(html).toContain('Emissor Inteligente de Notas Fiscais');
    expect(html).toContain('Natureza da Operação (Fiscal)');
    expect(html).toContain('Venda de Mercadoria Adquirida de Terceiros (CFOP 5.102 / 6.102)');
    expect(html).toContain('Venda de Produção do Estabelecimento (CFOP 5.101 / 6.101)');
    expect(html).toContain('NF-e Modelo 55');
    expect(html).toContain('NFS-e Padrão Nacional');
    expect(html).toContain('NFC-e Modelo 65');
  });

  it('2. Renderiza o Emissor conectado ao Cadastro Central de Clientes e Fornecedores', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeInvoiceBillingIssuerView));

    expect(html).toContain('Destinatário / Tomador (Do Cadastro Central)');
    expect(html).toContain('INDÚSTRIA METALÚRGICA PAULISTA S/A');
    expect(html).toContain('12.345.678/0001-90');
    expect(html).toContain('DISTRIBUIDORA DE ALIMENTOS BRASIL LTDA');
  });

  it('3. Renderiza o Módulo Central de Cadastro de Clientes, Fornecedores & Parceiros Comerciais', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeBusinessPartnersRegistryView));

    expect(html).toContain('Central de Clientes, Fornecedores &amp; Parceiros Comerciais');
    expect(html).toContain('CADASTRO UNIFICADO RFB / SINTEGRA');
    expect(html).toContain('Clientes Ativos (Tomadores)');
    expect(html).toContain('Fornecedores Homologados');
    expect(html).toContain('Transportadoras (Frete)');
    expect(html).toContain('INDÚSTRIA METALÚRGICA PAULISTA S/A');
    expect(html).toContain('PETROQUÍMICA &amp; POLÍMEROS NACIONAL S/A');
    expect(html).toContain('LOGÍSTICA &amp; TRANSPORTES EXPRESS S/A');
  });
});
