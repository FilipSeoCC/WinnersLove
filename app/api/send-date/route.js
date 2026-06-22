import { Resend } from "resend";

const DEFAULT_TO_EMAIL = "fkedziorawenet@gmail.com";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidPayload(data) {
  return Boolean(
    data &&
    data.year &&
    data.month &&
    data.day &&
    data.hour &&
    data.formattedDate
  );
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!isValidPayload(data)) {
      return Response.json({ ok: false }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
      return Response.json({ ok: false }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.TO_EMAIL || DEFAULT_TO_EMAIL;
    const submittedAt = data.submittedAt || new Date().toISOString();
    const formattedDate = escapeHtml(data.formattedDate);

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: "Nowa jamnikowa randka",
      html: `
        <div style="font-family: Arial, sans-serif; color: #7a2f51; line-height: 1.6;">
          <h1>Jamnik potwierdza randkę!</h1>
          <p>Wybrany termin: <strong>${formattedDate}</strong></p>
          <ul>
            <li>Rok: ${escapeHtml(data.year)}</li>
            <li>Miesiąc: ${escapeHtml(data.month)}</li>
            <li>Dzień: ${escapeHtml(data.day)}</li>
            <li>Godzina: ${escapeHtml(data.hour)}</li>
            <li>Zgłoszono: ${escapeHtml(submittedAt)}</li>
          </ul>
          <p>Jamnik już szykuje kokardkę.</p>
        </div>
      `,
      text: [
        "Jamnik potwierdza randkę!",
        `Wybrany termin: ${data.formattedDate}`,
        `Rok: ${data.year}`,
        `Miesiąc: ${data.month}`,
        `Dzień: ${data.day}`,
        `Godzina: ${data.hour}`,
        `Zgłoszono: ${submittedAt}`,
        "Jamnik już szykuje kokardkę."
      ].join("\n")
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
