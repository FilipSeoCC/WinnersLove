"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dachshund from "@/components/Dachshund";
import FloatingHearts from "@/components/FloatingHearts";
import Confetti from "@/components/Confetti";
import { playYesChime, vibrateYes } from "@/lib/feedback";
import {
  monthNames,
  hours,
  getDaysInMonth,
  formatHourLabel,
  isSameCalendarDate,
  getMinSelectableDate
} from "@/lib/calendarSlots";

export default function InvitationCard({
  token,
  initialStatus,
  recipientLabel,
  initialFormattedDate,
  bookedSlots
}) {
  if (initialStatus === "yes") {
    return (
      <main className="app-shell">
        <FloatingHearts active />
        <section className="date-card success-card">
          <Dachshund mood="happy" />
          <p className="kicker">hau, mamy to</p>
          <h1>ta randka jest już potwierdzona</h1>
          <p className="success-copy">Umówiony termin: {initialFormattedDate}.</p>
        </section>
      </main>
    );
  }

  if (initialStatus === "no") {
    return (
      <main className="app-shell">
        <section className="date-card">
          <Dachshund mood="sweet" />
          <p className="kicker">jamnik rozumie</p>
          <h1>odpowiedź została już zapisana</h1>
          <p className="soft-message">Dzięki, że dałaś/dałeś znać.</p>
        </section>
      </main>
    );
  }

  return <PendingInvitation token={token} recipientLabel={recipientLabel} bookedSlots={bookedSlots || []} />;
}

function randomEscapeOffset() {
  return {
    x: Math.round((Math.random() - 0.5) * 200),
    y: Math.round((Math.random() - 0.5) * 140)
  };
}

function PendingInvitation({ token, recipientLabel, bookedSlots }) {
  const now = new Date();
  const minDate = useMemo(() => getMinSelectableDate(now), [now]);
  const bookedSet = useMemo(() => new Set(bookedSlots), [bookedSlots]);

  const [step, setStep] = useState("question");
  const [happy, setHappy] = useState(false);
  const [escaping, setEscaping] = useState(false);
  const [escapeOffset, setEscapeOffset] = useState({ x: 90, y: -46 });
  const [declined, setDeclined] = useState(false);
  const [year, setYear] = useState(minDate.getFullYear());
  const [month, setMonth] = useState(minDate.getMonth() + 1);
  const [day, setDay] = useState(minDate.getDate());
  const [hour, setHour] = useState(() => {
    if (!isSameCalendarDate(minDate, now)) {
      return "18:00";
    }
    const nowLabel = formatHourLabel(now);
    return hours.find((item) => item > nowLabel) || "18:00";
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const yesHandledRef = useRef(false);
  const sendingRef = useRef(false);

  const years = useMemo(() => {
    const currentYear = now.getFullYear();
    return Array.from({ length: 5 }, (_, index) => currentYear + index);
  }, [now]);

  const months = useMemo(() => {
    const minMonth = Number(year) === minDate.getFullYear() ? minDate.getMonth() + 1 : 1;
    return monthNames
      .map((name, index) => ({ name, value: index + 1 }))
      .filter((item) => item.value >= minMonth);
  }, [year, minDate]);

  const days = useMemo(() => {
    const count = getDaysInMonth(Number(year), Number(month));
    const isMinMonth = Number(year) === minDate.getFullYear() && Number(month) === minDate.getMonth() + 1;
    const minDay = isMinMonth ? minDate.getDate() : 1;
    const nowLabel = formatHourLabel(now);
    const candidates = [];

    for (let candidateDay = minDay; candidateDay <= count; candidateDay += 1) {
      const isToday = isMinMonth && candidateDay === minDate.getDate();
      const dayHours = isToday ? hours.filter((item) => item > nowLabel) : hours;
      const hasFreeHour = dayHours.some(
        (item) => !bookedSet.has(`${year}-${month}-${candidateDay}-${item}`)
      );
      if (hasFreeHour) {
        candidates.push(candidateDay);
      }
    }

    return candidates;
  }, [year, month, minDate, now, bookedSet]);

  const hourOptions = useMemo(() => {
    const isMinDay =
      Number(year) === minDate.getFullYear() &&
      Number(month) === minDate.getMonth() + 1 &&
      Number(day) === minDate.getDate();

    const base = isMinDay ? hours.filter((item) => item > formatHourLabel(now)) : hours;
    const available = base.filter((item) => !bookedSet.has(`${year}-${month}-${day}-${item}`));
    return available.length ? available : base;
  }, [year, month, day, minDate, now, bookedSet]);

  useEffect(() => {
    if (months.length && !months.some((item) => item.value === Number(month))) {
      setMonth(months[0].value);
    }
  }, [months, month]);

  useEffect(() => {
    if (!days.length) {
      return;
    }
    if (!days.includes(Number(day))) {
      setDay(day < days[0] ? days[0] : days[days.length - 1]);
    }
  }, [day, days]);

  useEffect(() => {
    if (hourOptions.length && !hourOptions.includes(hour)) {
      setHour(hourOptions[0]);
    }
  }, [hourOptions, hour]);

  const formattedDate = useMemo(() => {
    const paddedDay = String(day).padStart(2, "0");
    const paddedMonth = String(month).padStart(2, "0");
    return `${paddedDay}.${paddedMonth}.${year} o ${hour}`;
  }, [day, month, year, hour]);

  function handleYes() {
    if (yesHandledRef.current || happy || step !== "question") {
      return;
    }

    yesHandledRef.current = true;
    setHappy(true);
    setMessage("");
    playYesChime();
    vibrateYes();
    window.setTimeout(() => setStep("calendar"), 320);
  }

  function handleNoAttempt(event) {
    event.preventDefault();

    setEscapeOffset(randomEscapeOffset());
    setEscaping(true);
    setMessage("hej, ta kość właśnie zmieniła właściciela");
    window.setTimeout(() => {
      setEscaping(false);
      setMessage("jamnik zostawił tylko jedną rozsądną odpowiedź");
    }, 900);
  }

  async function handleDecline() {
    if (sendingRef.current) {
      return;
    }
    sendingRef.current = true;

    try {
      await fetch(`/api/invitations/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: "no", submittedAt: new Date().toISOString() })
      });
    } catch {
      // nawet jesli zapis w tle sie nie udal, i tak pokazujemy ekran zakonczenia -
      // nie zmuszamy do ponownych prob, gdy decyzja juz zapadla
    }

    setDeclined(true);
  }

  async function submitDate(event) {
    event.preventDefault();

    if (sendingRef.current || status === "sending") {
      return;
    }

    sendingRef.current = true;
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(`/api/invitations/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: "yes",
          year,
          month,
          day,
          hour,
          formattedDate,
          submittedAt: new Date().toISOString()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        if (data.error === "slot_taken") {
          sendingRef.current = false;
          setStatus("error");
          setMessage("ten termin przed chwilą zniknął - wybierz inny");
          return;
        }
        throw new Error("Request failed");
      }

      setHappy(true);
      setStatus("success");
      setStep("success");
    } catch {
      sendingRef.current = false;
      setStatus("error");
      setMessage("coś poszło nie tak, ale jamnik nadal wierzy w tę randkę");
    }
  }

  if (declined) {
    return (
      <main className="app-shell">
        <section className="date-card">
          <Dachshund mood="sweet" />
          <p className="kicker">jamnik rozumie</p>
          <h1>dzięki, że dałaś znać</h1>
          <p className="soft-message">Twoja odpowiedź została zapisana.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <FloatingHearts active={happy || step === "success"} />
      <Confetti active={step === "success"} />
      <section className={`date-card ${step === "success" ? "success-card" : ""}`}>
        <div className="sparkle-row" aria-hidden="true">
          <span>{"♥"}</span>
          <span>{"✦"}</span>
          <span>{"♥"}</span>
        </div>

        <div className={`panel question-panel ${step !== "question" ? "is-hidden" : ""}`}>
          <Dachshund mood={happy ? "happy" : "sweet"} escaping={escaping} />
          <p className="kicker">mała jamnikowa misja</p>
          <h1>{recipientLabel ? `${recipientLabel}, czy` : "czy"} umówisz się na randkę?</h1>

          <div className="button-row">
            <a className="bone-button yes-button" href="#calendar" onClick={handleYes}>
              TAK
            </a>
            <button
              className={`bone-button no-button ${escaping ? "is-running" : ""}`}
              type="button"
              style={{ "--escape-x": `${escapeOffset.x}px`, "--escape-y": `${escapeOffset.y}px` }}
              onPointerDown={handleNoAttempt}
              onTouchStart={handleNoAttempt}
              onClick={handleNoAttempt}
            >
              NIE
            </button>
          </div>
          <p className="soft-message" aria-live="polite">{message}</p>
          <button className="link-button" type="button" onClick={handleDecline}>
            nie, dziękuję
          </button>
        </div>

        <div id="calendar" className={`panel calendar-panel ${step !== "calendar" ? "is-hidden" : ""}`}>
          <Dachshund mood="happy" />
          <p className="kicker">jamnik merda z ekscytacji</p>
          <h1>wybierz termin randki</h1>
          <form className="date-form" onSubmit={submitDate}>
            <label>
              <span>rok</span>
              <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
                {years.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span>miesiąc</span>
              <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
                {months.map((item) => (
                  <option key={item.value} value={item.value}>{item.name}</option>
                ))}
              </select>
            </label>

            <label>
              <span>dzień</span>
              <select value={day} onChange={(event) => setDay(Number(event.target.value))}>
                {days.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span>godzina</span>
              <select value={hour} onChange={(event) => setHour(event.target.value)}>
                {hourOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="date-preview">
              <span>wybrano</span>
              <strong>{formattedDate}</strong>
            </div>

            <button
              className="bone-button confirm-button"
              type="submit"
              disabled={status === "sending"}
              onTouchEnd={submitDate}
            >
              {status === "sending" ? "jamnik niesie wiadomość..." : "potwierdzam randkę"}
            </button>
          </form>
          <p className="soft-message error" aria-live="polite">{message}</p>
          <button className="link-button" type="button" onClick={handleDecline}>
            jednak nie, dziękuję
          </button>
        </div>

        <div className={`panel success-panel ${step !== "success" ? "is-hidden" : ""}`}>
          <Dachshund mood="happy" />
          <p className="kicker">hau, mamy to</p>
          <h1>randka zapisana! jamnik już szykuje kokardkę</h1>
          <p className="success-copy">Termin poleciał mailem: {formattedDate}.</p>
        </div>
      </section>
    </main>
  );
}
