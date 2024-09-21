import type { SignUpEmailTemplateLang } from '../types';

export const en: SignUpEmailTemplateLang = ({
  code,
  organization,
  confirmLink,
}) => {
  const subject = `${code} -${organization?.name ? ` ${organization.name}` : ''} Sign-up Verification`;

  return {
    subject,
    html: `
<div class="body">
  <div class="container">
    ${
      organization?.logoUrl
        ? `
      <div class="header">
        <img class="header-img" src="${organization.logoUrl}" alt="Company Logo" />
      </div>`
        : ''
    }
    <div class="content">
      <h1 class="title">Verify your email to sign up${organization?.name ? ` for <strong>${organization.name}</strong>` : ''}</h1>
      <p class="paragraph">We have received a sign-up attempt.</p>
      <p class="paragraph">
        To complete the sign-up process; enter the ${code.length}-digit code in the original
        window:
      </p>
      <span class="code">${code}</span>
      <p class="paragraph">
        Or visit the link below to open the confirmation page in a new window or
        device:
      </p>
      <div class="link">
        <a href="${confirmLink}">${confirmLink}</a>
      </div>
    </div>
    <div class="footer">
      <p>If you did not request this, please ignore this email. No account will be created.</p>
      <p>Don't share or forward the 6-digit code with anyone. Our customer service will never ask for it. Do not read this code out loud.</p>
    </div>
  </div>
</div>`,
  };
};
