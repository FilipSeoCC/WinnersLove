const confettiPositions = [4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 98];
const confettiColors = [
  "var(--pink-strong)",
  "var(--mint)",
  "var(--caramel)",
  "#ffd166",
  "var(--berry)"
];

export default function Confetti({ active }) {
  return (
    <div className={`confetti ${active ? "confetti-active" : ""}`} aria-hidden="true">
      {confettiPositions.map((left, index) => (
        <span
          key={index}
          style={{
            "--left": `${left}%`,
            "--delay": `${index * -0.35}s`,
            "--piece-color": confettiColors[index % confettiColors.length],
            "--rotate": `${(index * 47) % 360}deg`
          }}
        />
      ))}
    </div>
  );
}
