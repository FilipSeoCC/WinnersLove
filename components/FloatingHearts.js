const heartPositions = [7, 14, 21, 30, 37, 45, 52, 60, 67, 74, 82, 89, 95, 99];
const heartSizes = [18, 24, 20, 31, 17, 27, 22, 34, 19, 26, 21, 30, 18, 24];

export default function FloatingHearts({ active }) {
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
          {"♥"}
        </span>
      ))}
    </div>
  );
}
