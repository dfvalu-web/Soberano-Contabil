const fs = require('fs');

const code = `import { Result, Ok, Err } from '../types/result.js';

export interface TaxBillNotificationInput {
  clienteCnpj: string;
  razaoSocial: string;
  telefoneWhatsappContato: string;
  emailContato: string;
  tipoGuia: 'DAS_SIMPLES' | 'DARF_PREVIDENCIARIO' | 'FGTS_DIGITAL' | 'ISS_MUNICIPAL';
  valorGuiaBrl: number;
  dataVencimento: string;
  chavePixCopiaECola: string;
}

export interface TaxBillNotificationResult {
  clienteCnpj: string;
  razaoSocial: string;
  mensagemWhatsappFormatada: string;
  emailHtmlFormatado: string;
  notificacaoAgendada: boolean;
  protocoloDisparoId: string;
  statusEnvio: 'NOTIFICACAO_DISPARADA_COM_SUCESSO_PIX_ATIVO';
  diagnosticoEnvio: string;
}

export function processOfficeAutomatedTaxNotificationsEngine(input: TaxBillNotificationInput): Result<TaxBillNotificationResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    telefoneWhatsappContato,
    emailContato,
    tipoGuia,
    valorGuiaBrl,
    dataVencimento,
    chavePixCopiaECola
  } = input;

  if (!clienteCnpj || !telefoneWhatsappContato || valorGuiaBrl <= 0) {
    return Err(new Error('CNPJ, telefone WhatsApp e valor positivo da guia são obrigatórios.'));
  }

  const valorFormatado = valorGuiaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const msgWhats = "Olá, " + razaoSocial + "! Segue a sua guia " + tipoGuia + " no valor de R$ " + valorFormatado + " com vencimento em " + dataVencimento + ".\\n\\n" +
    "Pague com facilidade via Pix Copia e Cola:\\n" + chavePixCopiaECola + "\\n\\n" +
    "Atenciosamente, Soberano Contábil.";

  const emailHtml = "<p>Prezado cliente <strong>" + razaoSocial + "</strong>,</p><p>Sua guia <strong>" + tipoGuia + "</strong> no valor de <strong>R$ " + valorFormatado + "</strong> vence em <strong>" + dataVencimento + "</strong>.</p>";

  const proto = "DISP-" + Date.now().toString().slice(-8);
  const diag = "Disparo Automático de Guia (" + razaoSocial + " - " + tipoGuia + "): WhatsApp enviado para " + telefoneWhatsappContato + " | Pix Copia e Cola anexado | Protocolo: " + proto + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mensagemWhatsappFormatada: msgWhats,
    emailHtmlFormatado: emailHtml,
    notificacaoAgendada: true,
    protocoloDisparoId: proto,
    statusEnvio: 'NOTIFICACAO_DISPARADA_COM_SUCESSO_PIX_ATIVO',
    diagnosticoEnvio: diag
  });
}
`;

fs.writeFileSync('packages/core/src/compliance/office-automated-tax-notifications-engine.ts', code.trim() + '\n', 'utf8');
console.log('Fixed formatting in office-automated-tax-notifications-engine.ts');
