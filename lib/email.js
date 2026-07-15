import { Resend } from "resend";

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendInvitationYesEmail({
  toEmail,
  recipientLabel,
  formattedDate,
  year,
  month,
  day,
  hour,
  submittedAt
}) {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("Resend nie jest skonfigurowany");
  }

  const safeLabel = escapeHtml(recipientLabel || "Ktos");
  const safeDate = escapeHtml(formattedDate);

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: `${safeLabel} odpowiedziała TAK na Twoja jamnikowa randke!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #7a2f51; line-height: 1.6;">
        <h1>Jamnik potwierdza randk&#281;!</h1>
        <p>${safeLabel} zgodzi&#322;a si&#281; na randk&#281;. Wybrany termin: <strong>${safeDate}</strong></p>
        <ul>
          <li>Rok: ${escapeHtml(year)}</li>
          <li>Miesi&#261;c: ${escapeHtml(month)}</li>
          <li>Dzie&#324;: ${escapeHtml(day)}</li>
          <li>Godzina: ${escapeHtml(hour)}</li>
          <li>Zg&#322;oszono: ${escapeHtml(submittedAt)}</li>
        </ul>
        <p>Jamnik ju&#380; szykuje kokardk&#281;.</p>
      </div>
    `,
    text: [
      `${recipientLabel || "Ktos"} odpowiedziala TAK!`,
      `Wybrany termin: ${formattedDate}`,
      `Rok: ${year}`,
      `Miesiac: ${month}`,
      `Dzien: ${day}`,
      `Godzina: ${hour}`,
      `Zgloszono: ${submittedAt}`,
      "Jamnik juz szykuje kokardke."
    ].join("\n")
  });
}

export async function sendInvitationNoEmail({ toEmail, recipientLabel, submittedAt }) {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("Resend nie jest skonfigurowany");
  }

  const safeLabel = escapeHtml(recipientLabel || "Ktos");

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: `${safeLabel} odpowiedziała na Twoje zaproszenie`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #7a2f51; line-height: 1.6;">
        <h1>Odpowied&#378; dotar&#322;a</h1>
        <p>${safeLabel} tym razem odpowiedzia&#322;a NIE.</p>
        <p>Zg&#322;oszono: ${escapeHtml(submittedAt)}</p>
      </div>
    `,
    text: [
      `${recipientLabel || "Ktos"} odpowiedziala NIE.`,
      `Zgloszono: ${submittedAt}`
    ].join("\n")
  });
}

export async function sendPasswordResetEmail({ toEmail, resetUrl }) {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("Resend nie jest skonfigurowany");
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: "Reset hasla - Jamnikowa Randka",
    html: `
      <div style="font-family: Arial, sans-serif; color: #7a2f51; line-height: 1.6;">
        <h1>Reset has&#322;a</h1>
        <p>Kliknij poni&#380;szy link, aby ustawi&#263; nowe has&#322;o. Link jest wa&#380;ny 1 godzin&#281;.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Je&#347;li to nie Ty prosi&#322;e&#347;/prosi&#322;a&#347; o reset, zignoruj t&#281; wiadomo&#347;&#263;.</p>
      </div>
    `,
    text: [
      "Reset hasla - Jamnikowa Randka",
      `Link (wazny 1 godzine): ${resetUrl}`,
      "Jesli to nie Ty prosiles/prosilas o reset, zignoruj te wiadomosc."
    ].join("\n")
  });
}
