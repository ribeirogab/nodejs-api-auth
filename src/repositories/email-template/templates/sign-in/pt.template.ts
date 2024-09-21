import type { SignInEmailTemplateLang } from '../types';

export const pt: SignInEmailTemplateLang = ({
  organization,
  confirmLink,
  username,
  code,
}) => {
  const subject = `${code} -${organization?.name ? ` ${organization.name}` : ''} Verificação de Login`;

  return {
    subject,
    html: `
<div class="body">
  <div class="container">
    ${
      organization?.logoUrl
        ? `
      <div class="header">
        <img src="${organization.logoUrl}" alt="Logo da Empresa" />
      </div>`
        : ''
    }
    <div class="content">
      <h1>Verifique seu e-mail para fazer login${organization?.name ? ` na <strong>${organization.name}</strong>` : ''}</h1>
      <p>Olá <strong>${username}</strong>,</p>
      <p>Recebemos uma tentativa de login.</p>
      <p>
        Para concluir o processo de login, insira o código de ${code.length} dígitos na janela original:
      </p>
      <span class="code">${code}</span>
      <p>
        Ou visite o link abaixo para abrir a página de confirmação em uma nova janela ou
        dispositivo:
      </p>
      <div class="link">
        <a href="${confirmLink}">${confirmLink}</a>
      </div>
    </div>
    <div class="footer">
      <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
      <p>Não compartilhe ou encaminhe o código de ${code.length} dígitos com ninguém. Nosso serviço de atendimento ao cliente nunca solicitará este código. Não leia este código em voz alta.</p>
    </div>
  </div>
</div>`,
  };
};
