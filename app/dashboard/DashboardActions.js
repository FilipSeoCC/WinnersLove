"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardActions() {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleExport() {
    const response = await fetch("/api/account/export");
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jamnikowa-randka-moje-dane.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    await fetch("/api/account/delete", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="dashboard-actions">
      <button className="bone-button no-button" type="button" onClick={handleExport}>
        pobierz moje dane
      </button>
      <button className="bone-button no-button" type="button" onClick={handleDelete} disabled={deleting}>
        {confirmDelete ? "na pewno usun\u0105\u0107 konto?" : "usu\u0144 konto"}
      </button>
      <button className="bone-button no-button" type="button" onClick={handleLogout}>
        wyloguj si\u0119
      </button>
    </div>
  );
}
