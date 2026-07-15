import { getRedisClient } from "@/lib/redis";
import { sendInvitationYesEmail, sendInvitationNoEmail } from "@/lib/email";

function isValidYesPayload(data) {
  return Boolean(data && data.year && data.month && data.day && data.hour && data.formattedDate);
}

async function isSlotTaken(redis, ownerId, currentToken, data) {
  const ownerTokens = await redis.zrange(`user:${ownerId}:invitations`, 0, -1);
  if (!ownerTokens.length) {
    return false;
  }

  const ownerInvitations = await Promise.all(ownerTokens.map((item) => redis.get(`invitation:${item}`)));

  return ownerInvitations.some(
    (item) =>
      item &&
      item.token !== currentToken &&
      item.status === "yes" &&
      String(item.year) === String(data.year) &&
      String(item.month) === String(data.month) &&
      String(item.day) === String(data.day) &&
      item.hour === data.hour
  );
}

export async function GET(request, { params }) {
  const { token } = await params;
  const redis = getRedisClient();
  const invitation = await redis.get(`invitation:${token}`);

  if (!invitation) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    invitation: {
      recipientLabel: invitation.recipientLabel,
      status: invitation.status,
      formattedDate: invitation.formattedDate || null
    }
  });
}

export async function POST(request, { params }) {
  try {
    const { token } = await params;
    const redis = getRedisClient();
    const invitation = await redis.get(`invitation:${token}`);

    if (!invitation) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    if (invitation.status !== "pending") {
      return Response.json({ ok: false, error: "already_answered" }, { status: 409 });
    }

    const data = await request.json();
    const answer = data.answer === "yes" ? "yes" : data.answer === "no" ? "no" : null;
    const respondentName = typeof data.respondentName === "string" ? data.respondentName.trim().slice(0, 80) : "";

    if (!answer) {
      return Response.json({ ok: false, error: "invalid_answer" }, { status: 400 });
    }

    if (!respondentName) {
      return Response.json({ ok: false, error: "name_required" }, { status: 400 });
    }

    if (answer === "yes" && !isValidYesPayload(data)) {
      return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    if (answer === "yes" && (await isSlotTaken(redis, invitation.userId, token, data))) {
      return Response.json({ ok: false, error: "slot_taken" }, { status: 409 });
    }

    const respondedAt = new Date().toISOString();
    const updatedInvitation = {
      ...invitation,
      status: answer,
      respondentName,
      respondedAt
    };

    if (answer === "yes") {
      updatedInvitation.year = data.year;
      updatedInvitation.month = data.month;
      updatedInvitation.day = data.day;
      updatedInvitation.hour = data.hour;
      updatedInvitation.formattedDate = data.formattedDate;
    }

    await redis.set(`invitation:${token}`, updatedInvitation);

    const owner = await redis.get(`user:${invitation.userId}`);
    const displayName = respondentName || invitation.recipientLabel;

    if (owner && owner.email) {
      try {
        if (answer === "yes") {
          await sendInvitationYesEmail({
            toEmail: owner.email,
            recipientLabel: displayName,
            formattedDate: data.formattedDate,
            year: data.year,
            month: data.month,
            day: data.day,
            hour: data.hour,
            submittedAt: respondedAt
          });
        } else {
          await sendInvitationNoEmail({
            toEmail: owner.email,
            recipientLabel: displayName,
            submittedAt: respondedAt
          });
        }
      } catch (error) {
        console.error("Nie udalo sie wyslac maila z odpowiedzia na zaproszenie", error);
      }
    }

    return Response.json({ ok: true, status: answer });
  } catch (error) {
    console.error("Blad zapisu odpowiedzi na zaproszenie", error);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
