"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const monthNames = [
  "stycze\u0144",
  "luty",
  "marzec",
  "kwiecie\u0144",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpie\u0144",
  "wrzesie\u0144",
  "pa\u017adziernik",
  "listopad",
  "grudzie\u0144"
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

const heartPositions = [7, 14, 21, 30, 37, 45, 52, 60, 67, 74, 82, 89, 95, 99];
const heartSizes = [18, 24, 20, 31, 17, 27, 22, 34, 19, 26, 21, 30, 18, 24];

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
        <div className="bow">{"\u2665"}</div>
        {escaping ? <div className="stolen-bone">NIE</div> : null}
      </div>
    </div>
  );
}

function FloatingHearts({ active }) {
  return (
    <div className={`hearts ${active ? "hearts-active" : ""}`} aria-hidden="true">
      {heartPositions.map((left, index) => (
        <span
          key={index}
          style={{
            "--delay": `${index * -0.22}s`,
            "--left": `${left}%`,
            "--size": `${heartSizes[index]}px`
          }}
        >
          {"\u2665"}
        </span>
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
  const yesHandledRef = useRef(false);
  const sendingRef = useRef(false);

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
    if (yesHandledRef.current || happy || step !== "question") {
      return;
    }

    yesHandledRef.current = true;
    setHappy(true);
    setMessage("");
    window.setTimeout(() => setStep("calendar"), 320);
  }

  function handleNoAttempt(event) {
    event.preventDefault();

    if (escaping) {
      return;
    }

    setEscaping(true);
    setMessage("hej, ta ko\u015b\u0107 w\u0142a\u015bnie zmieni\u0142a w\u0142a\u015bciciela");
    window.setTimeout(() => {
      setEscaping(false);
      setMessage("jamnik zostawi\u0142 tylko jedn\u0105 rozs\u0105dn\u0105 odpowied\u017a");
    }, 1350);
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
      sendingRef.current = false;
      setStatus("error");
      setMessage("co\u015b posz\u0142o nie tak, ale jamnik nadal wierzy w t\u0119 randk\u0119");
    }
  }

  return (
    <main className="app-shell">
      <FloatingHearts active={happy || step === "success"} />
      <section className={`date-card ${step === "success" ? "success-card" : ""}`}>
        <div className="sparkle-row" aria-hidden="true">
          <span>{"\u2665"}</span>
          <span>{"\u2726"}</span>
          <span>{"\u2665"}</span>
        </div>

        <div className={`panel question-panel ${step !== "question" ? "is-hidden" : ""}`}>
            <Dachshund mood={happy ? "happy" : "sweet"} escaping={escaping} />
            <p className="kicker">{"ma\u0142a jamnikowa misja"}</p>
            <h1>{"czy um\u00f3wisz si\u0119 ze mn\u0105 na randk\u0119?"}</h1>
            <div className="button-row">
              <a
                className="bone-button yes-button"
                href="#calendar"
                onClick={handleYes}
              >
                TAK
              </a>
              <button
                className={`bone-button no-button ${escaping ? "is-running" : ""}`}
                type="button"
                onPointerDown={handleNoAttempt}
                onTouchStart={handleNoAttempt}
                onClick={handleNoAttempt}
              >
                NIE
              </button>
            </div>
            <p className="soft-message" aria-live="polite">{message}</p>
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
                <span>{"miesi\u0105c"}</span>
                <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
                  {monthNames.map((name, index) => (
                    <option key={name} value={index + 1}>{name}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>{"dzie\u0144"}</span>
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

              <button
                className="bone-button confirm-button"
                type="submit"
                disabled={status === "sending"}
                onTouchEnd={submitDate}
              >
                {status === "sending" ? "jamnik niesie wiadomo\u015b\u0107..." : "potwierdzam randk\u0119"}
              </button>
            </form>
            <p className="soft-message error" aria-live="polite">{message}</p>
        </div>

        <div className={`panel success-panel ${step !== "success" ? "is-hidden" : ""}`}>
            <Dachshund mood="happy" />
            <p className="kicker">hau, mamy to</p>
            <h1>{"randka zapisana! jamnik ju\u017c szykuje kokardk\u0119"}</h1>
            <p className="success-copy">{"Termin polecia\u0142 mailem"}: {formattedDate}.</p>
        </div>
      </section>
    </main>
  );
}
