import { Resend } from "resend";
import { Redis } from "@upstash/redis";

const DEFAULT_TO_EMAIL = "fkedziorawenet@gmail.com";
const SUBMISSIONS_KEY = "jamnikowa-randka:submissions";
const SUBMISSIONS_HISTORY_LIMIT = 200;

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

async function saveSubmissionHistory(record) {
  try {
    const redis = Redis.fromEnv();
    await redis.lpush(SUBMISSIONS_KEY, JSON.stringify(record));
    await redis.ltrim(SUBMISSIONS_KEY, 0, SUBMISSIONS_HISTORY_LIMIT - 1);
  } catch (error) {
    console.error("Nie udalo sie zapisac historii zgloszenia w Redis", error);
  }
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
          <h1>Jamnik potwierdza randk&#281;!</h1>
          <p>Wybrany termin: <strong>${formattedDate}</strong></p>
          <ul>
            <li>Rok: ${escapeHtml(data.year)}</li>
            <li>Miesi&#261;c: ${escapeHtml(data.month)}</li>
            <li>Dzie&#324;: ${escapeHtml(data.day)}</li>
            <li>Godzina: ${escapeHtml(data.hour)}</li>
            <li>Zg&#322;oszono: ${escapeHtml(submittedAt)}</li>
          </ul>
          <p>Jamnik ju&#380; szykuje kokardk&#281;.</p>
        </div>
      `,
      text: [
        "Jamnik potwierdza randke!",
        `Wybrany termin: ${data.formattedDate}`,
        `Rok: ${data.year}`,
        `Miesiac: ${data.month}`,
        `Dzien: ${data.day}`,
        `Godzina: ${data.hour}`,
        `Zgloszono: ${submittedAt}`,
        "Jamnik juz szykuje kokardke."
      ].join("\n")
    });

    await saveSubmissionHistory({
      year: data.year,
      month: data.month,
      day: data.day,
      hour: data.hour,
      formattedDate: data.formattedDate,
      submittedAt,
      receivedAt: new Date().toISOString()
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
