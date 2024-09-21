import type { SignUpEmailTemplateLang } from '../types';

export const pt: SignUpEmailTemplateLang = ({
  code,
  organization,
  confirmLink,
}) => {
  const subject = `${code} -${organization?.name ? ` ${organization.name}` : ''} Verificação de Cadastro`;

  return {
    subject,
    html: `
<div class="body">
  <div class="container">
    ${
      organization?.logoUrl
        ? `
      <div class="header">
        <img class="header-img" src="${organization.logoUrl}" alt="Logo da Empresa" />
      </div>`
        : ''
    }
    <div class="content">
      <h1 class="title">Verifique seu e-mail para se cadastrar${organization?.name ? ` na <strong>${organization.name}</strong>` : ''}</h1>
      <p class="paragraph">Recebemos uma tentativa de cadastro.</p>
      <p class="paragraph">
        Para concluir o processo de cadastro, insira o código de ${code.length} dígitos na janela original:
      </p>
      <span class="code">${code}</span>
      <p class="paragraph">
        Ou visite o link abaixo para abrir a página de confirmação em uma nova janela ou
        dispositivo:
      </p>
      <div class="link">
        <a href="${confirmLink}">${confirmLink}</a>
      </div>
    </div>
    <div class="footer">
      <p>Se você não solicitou isso, por favor, ignore este e-mail. Nenhuma conta será criada.</p>
      <p>Não compartilhe ou encaminhe o código de 6 dígitos com ninguém. Nosso atendimento ao cliente nunca solicitará este código. Não leia este código em voz alta.</p>
    </div>
  </div>
</div>`,
  };
};
