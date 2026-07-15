import { getRedisClient } from "@/lib/redis";
import InvitationCard from "./InvitationCard";

export default async function InvitationPage({ params }) {
  const { token } = await params;
  const redis = getRedisClient();
  const invitation = await redis.get(`invitation:${token}`);

  if (!invitation) {
    return (
      <main className="app-shell">
        <section className="date-card">
          <p className="kicker">jamnikowa randka</p>
          <h1>nie znaleziono zaproszenia</h1>
          <p className="soft-message">Ten link jest nieprawid\u0142owy albo zaproszenie zosta\u0142o usuni\u0119te.</p>
        </section>
      </main>
    );
  }

  const ownerTokens = await redis.zrange(`user:${invitation.userId}:invitations`, 0, -1);
  const ownerInvitations = ownerTokens.length
    ? await Promise.all(ownerTokens.map((item) => redis.get(`invitation:${item}`)))
    : [];

  const bookedSlots = ownerInvitations
    .filter((item) => item && item.status === "yes" && item.token !== token)
    .map((item) => `${item.year}-${item.month}-${item.day}-${item.hour}`);

  return (
    <InvitationCard
      token={token}
      initialStatus={invitation.status}
      recipientLabel={invitation.recipientLabel}
      initialRespondentName={invitation.respondentName || ""}
      initialFormattedDate={invitation.formattedDate || null}
      bookedSlots={bookedSlots}
    />
  );
}
