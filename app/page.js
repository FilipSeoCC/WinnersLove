"use client";

import { useEffect, useMemo, useState } from "react";

const monthNames = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień"
];

const hours = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00"
];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function Dachshund({ mood = "sweet", escaping = false }) {
  return (
    <div className={`dog-wrap ${mood === "happy" ? "dog-happy" : ""} ${escaping ? "dog-escape" : ""}`} aria-hidden="true">
      <div className="dog">
        <div className="tail" />
        <div className="body">
          <span className="spot spot-one" />
          <span className="spot spot-two" />
        </div>
        <div className="head">
          <div className="ear" />
          <div className="eye" />
          <div className="snout" />
          <div className="nose" />
          <div className="cheek" />
        </div>
        <div className="leg leg-one" />
        <div className="leg leg-two" />
        <div className="leg leg-three" />
        <div className="leg leg-four" />
        <div className="bow">♥</div>
        {escaping ? <div className="stolen-bone">NIE</div> : null}
      </div>
    </div>
  );
}

function FloatingHearts({ active }) {
  return (
    <div className={`hearts ${active ? "hearts-active" : ""}`} aria-hidden="true">
      {Array.from({ length: 14 }).map((_, index) => (
        <span key={index} style={{ "--i": index }}>♥</span>
      ))}
    </div>
  );
}

export default function Home() {
  const now = new Date();
  const [step, setStep] = useState("question");
  const [happy, setHappy] = useState(false);
  const [escaping, setEscaping] = useState(false);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState("18:00");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const years = useMemo(() => {
    const currentYear = now.getFullYear();
    return Array.from({ length: 5 }, (_, index) => currentYear + index);
  }, [now]);

  const days = useMemo(() => {
    const count = getDaysInMonth(Number(year), Number(month));
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [year, month]);

  useEffect(() => {
    const maxDay = getDaysInMonth(Number(year), Number(month));
    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [day, month, year]);

  const formattedDate = useMemo(() => {
    const paddedDay = String(day).padStart(2, "0");
    const paddedMonth = String(month).padStart(2, "0");
    return `${paddedDay}.${paddedMonth}.${year} o ${hour}`;
  }, [day, month, year, hour]);

  function handleYes() {
    setHappy(true);
    setMessage("");
    window.setTimeout(() => setStep("calendar"), 950);
  }

  function handleNoAttempt(event) {
    event.preventDefault();
    setEscaping(true);
    setMessage("hej, ta kość właśnie zmieniła właściciela");
    window.setTimeout(() => {
      setEscaping(false);
      setMessage("jamnik zostawił tylko jedną rozsądną odpowiedź");
    }, 1350);
  }

  async function submitDate(event) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/send-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          formattedDate,
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setHappy(true);
      setStatus("success");
      setStep("success");
    } catch {
      setStatus("error");
      setMessage("coś poszło nie tak, ale jamnik nadal wierzy w tę randkę");
    }
  }

  return (
    <main className="app-shell">
      <FloatingHearts active={happy || step === "success"} />
      <section className={`date-card ${step === "success" ? "success-card" : ""}`}>
        <div className="sparkle-row" aria-hidden="true">
          <span>♥</span>
          <span>✦</span>
          <span>♥</span>
        </div>

        {step === "question" ? (
          <>
            <Dachshund mood={happy ? "happy" : "sweet"} escaping={escaping} />
            <p className="kicker">mała jamnikowa misja</p>
            <h1>czy umówisz się ze mną na randkę?</h1>
            <div className="button-row">
              <button className="bone-button yes-button" type="button" onClick={handleYes}>
                TAK
              </button>
              <button
                className={`bone-button no-button ${escaping ? "is-running" : ""}`}
                type="button"
                onMouseEnter={handleNoAttempt}
                onFocus={handleNoAttempt}
                onTouchStart={handleNoAttempt}
                onClick={handleNoAttempt}
              >
                NIE
              </button>
            </div>
            <p className="soft-message" aria-live="polite">{message}</p>
          </>
        ) : null}

        {step === "calendar" ? (
          <>
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
                  {monthNames.map((name, index) => (
                    <option key={name} value={index + 1}>{name}</option>
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
                  {hours.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <div className="date-preview">
                <span>wybrano</span>
                <strong>{formattedDate}</strong>
              </div>

              <button className="bone-button confirm-button" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "jamnik niesie wiadomość..." : "potwierdzam randkę"}
              </button>
            </form>
            <p className="soft-message error" aria-live="polite">{message}</p>
          </>
        ) : null}

        {step === "success" ? (
          <>
            <Dachshund mood="happy" />
            <p className="kicker">hau, mamy to</p>
            <h1>randka zapisana! jamnik już szykuje kokardkę</h1>
            <p className="success-copy">Termin poleciał mailem: {formattedDate}.</p>
          </>
        ) : null}
      </section>
    </main>
  );
}
