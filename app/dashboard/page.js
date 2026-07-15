import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRedisClient } from "@/lib/redis";
import DashboardActions from "./DashboardActions";

const STATUS_LABELS = {
  pending: "czeka na odpowied\u017a",
  yes: "odpowiedzia\u0142a TAK",
  no: "odpowiedzia\u0142a NIE"
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const redis = getRedisClient();
  const tokens = await redis.zrange(`user:${user.id}:invitations`, 0, -1, { rev: true });
  const invitations = tokens.length
    ? (await Promise.all(tokens.map((token) => redis.get(`invitation:${token}`)))).filter(Boolean)
    : [];

  return (
    <main className="app-shell">
      <section className="date-card dashboard-card">
        <p className="kicker">jamnikowa randka</p>
        <h1>tw\u00f3j panel</h1>
        <p className="dashboard-meta">Zalogowano jako {user.email}</p>

        <Link className="bone-button confirm-button" href="/dashboard/new">
          nowe zaproszenie
        </Link>

        {invitations.length === 0 ? (
          <p className="soft-message">Nie masz jeszcze \u017cadnych zaprosze\u0144.</p>
        ) : (
          <ul className="invitation-list">
            {invitations.map((invitation) => (
              <li key={invitation.token} className={`invitation-item status-${invitation.status}`}>
                <div className="invitation-item-main">
                  <strong>{invitation.respondentName || invitation.recipientLabel || "bez etykiety"}</strong>
                  <span className="invitation-status">
                    {STATUS_LABELS[invitation.status] || invitation.status}
                  </span>
                </div>
                {invitation.formattedDate ? (
                  <p className="invitation-date">termin: {invitation.formattedDate}</p>
                ) : null}
                <p className="invitation-link">/r/{invitation.token}</p>
              </li>
            ))}
          </ul>
        )}

        <DashboardActions />
      </section>
    </main>
  );
}
