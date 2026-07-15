import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRedisClient } from "@/lib/redis";
import DashboardActions from "./DashboardActions";

const STATUS_LABELS = {
  pending: "czeka na odpowiedź",
  yes: "odpowiedziała TAK",
  no: "odpowiedziała NIE"
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
        <h1>twój panel</h1>
        <p className="dashboard-meta">Zalogowano jako {user.email}</p>

        <Link className="bone-button confirm-button" href="/dashboard/new">
          nowe zaproszenie
        </Link>

        {invitations.length === 0 ? (
          <p className="soft-message">Nie masz jeszcze żadnych zaproszeń.</p>
        ) : (
          <ul className="invitation-list">
            {invitations.map((invitation) => (
              <li key={invitation.token} className={`invitation-item status-${invitation.status}`}>
                <div className="invitation-item-main">
                  <strong>{invitation.recipientLabel || "bez etykiety"}</strong>
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
