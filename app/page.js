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
