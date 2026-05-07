import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Change to your verified Resend domain for production
const FROM = 'BFA Talento <onboarding@resend.dev>'

const PROGRAMS: Record<string, string> = {
  fbfa: 'Futuro BFA',
  bif:  'Bolsa Internacional',
  bnac: 'Bolsa Nacional',
  lid:  'Programa Liderança+',
  mest: 'Mestrado Patrocinado',
}

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>BFA Talento</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F2;font-family:Inter,Helvetica Neue,Arial,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F2;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#1A1A1A;border-radius:12px 12px 0 0;padding:28px 40px;display:block;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#FF7607;border-radius:6px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                        <span style="color:#fff;font-weight:700;font-size:16px;line-height:36px;">B</span>
                      </td>
                      <td style="padding-left:12px;color:#fff;font-weight:700;font-size:17px;vertical-align:middle;">
                        BFA Talento
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;">
            ${content}
            <hr style="border:none;border-top:1px solid #E7E5E1;margin:32px 0;" />
            <p style="font-size:12px;color:#8A8A87;line-height:1.6;margin:0;">
              Banco de Fomento Angola · Programa de Talentos<br />
              Este email foi gerado automaticamente. Não responda a este endereço.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function pill(text: string, bg: string, color: string) {
  return `<span style="display:inline-block;background:${bg};color:${color};padding:4px 14px;border-radius:20px;font-size:13px;font-weight:600;">${text}</span>`
}

function refBlock(ref: string) {
  return `<div style="background:#F4F4F2;border-radius:8px;padding:14px 20px;margin:20px 0;font-family:monospace;font-size:15px;">
    Referência: <strong style="color:#FF7607;">${ref}</strong>
  </div>`
}

export async function sendConfirmation(to: string, nome: string, ref: string, program: string) {
  const progName = PROGRAMS[program] ?? program
  const firstName = nome.split(' ')[0]

  const html = base(`
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px;">
      Candidatura recebida!
    </h1>
    <p style="font-size:15px;color:#525252;margin:0 0 24px;line-height:1.6;">
      Olá <strong>${firstName}</strong>,<br/>
      recebemos a tua candidatura ao programa <strong>${progName}</strong>. Obrigado pelo interesse no BFA Talento!
    </p>
    ${refBlock(ref)}
    <p style="font-size:14px;color:#525252;line-height:1.7;margin:20px 0;">
      <strong>O que acontece a seguir?</strong><br />
      A nossa equipa irá analisar a tua candidatura nos próximos <strong>14 dias úteis</strong>.
      Receberás uma notificação por email com o resultado.<br/><br/>
      Podes acompanhar o estado da tua candidatura no portal:
    </p>
    <a href="${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/portal"
       style="display:inline-block;background:#FF7607;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-top:4px;">
      Ver estado da candidatura →
    </a>
    <p style="font-size:13px;color:#8A8A87;margin-top:20px;">
      Usa a tua referência <strong>${ref}</strong> e este email para aceder ao portal.
    </p>
  `)

  return resend.emails.send({ from: FROM, to, subject: `Candidatura recebida — ${ref}`, html })
}

export async function sendApproval(to: string, nome: string, ref: string, program: string) {
  const progName = PROGRAMS[program] ?? program
  const firstName = nome.split(' ')[0]

  const html = base(`
    <div style="margin-bottom:20px;">
      ${pill('Candidatura aprovada', '#D1FAE5', '#065F46')}
    </div>
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px;">
      Parabéns, ${firstName}!
    </h1>
    <p style="font-size:15px;color:#525252;margin:0 0 24px;line-height:1.6;">
      É com muito gosto que te informamos que a tua candidatura ao programa
      <strong>${progName}</strong> foi <strong>aprovada</strong>.
    </p>
    ${refBlock(ref)}
    <p style="font-size:14px;color:#525252;line-height:1.7;margin:20px 0;">
      <strong>Próximos passos:</strong><br />
      A nossa equipa de Recursos Humanos irá entrar em contacto contigo brevemente
      para tratar dos detalhes de integração. Por favor, mantém o email e telemóvel disponíveis.
    </p>
    <a href="${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/portal"
       style="display:inline-block;background:#065F46;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-top:4px;">
      Ver o teu portal →
    </a>
    <p style="font-size:13px;color:#8A8A87;margin-top:24px;">
      Bem-vindo(a) à família BFA Talento!
    </p>
  `)

  return resend.emails.send({ from: FROM, to, subject: `Parabéns! Candidatura aprovada — ${ref}`, html })
}

export async function sendRejection(to: string, nome: string, ref: string, program: string) {
  const progName = PROGRAMS[program] ?? program
  const firstName = nome.split(' ')[0]

  const html = base(`
    <div style="margin-bottom:20px;">
      ${pill('Resultado da candidatura', '#F3F4F6', '#374151')}
    </div>
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px;">
      Olá, ${firstName}
    </h1>
    <p style="font-size:15px;color:#525252;margin:0 0 24px;line-height:1.6;">
      Agradecemos o teu interesse no programa <strong>${progName}</strong> e o tempo
      que dedicaste à tua candidatura.
    </p>
    ${refBlock(ref)}
    <p style="font-size:14px;color:#525252;line-height:1.7;margin:20px 0;">
      Após uma análise cuidadosa, lamentamos informar que não foi possível selecionar
      a tua candidatura para esta edição do programa.<br/><br/>
      Esta decisão não reflecte necessariamente o teu valor ou potencial —
      a concorrência foi intensa e as vagas limitadas.
      Encorajamo-te a candidatares-te novamente na próxima edição.
    </p>
    <p style="font-size:14px;color:#525252;line-height:1.7;">
      Mantemo-nos em contacto e desejamos-te os maiores sucessos no teu percurso.
    </p>
    <p style="font-size:13px;color:#8A8A87;margin-top:24px;">
      — Equipa BFA Talento
    </p>
  `)

  return resend.emails.send({ from: FROM, to, subject: `Resultado da tua candidatura — ${ref}`, html })
}
