import Image from "next/image";

export default function Dachshund({ mood = "sweet", escaping = false }) {
  return (
    <div className={`dog-wrap ${mood === "happy" ? "dog-happy" : ""} ${escaping ? "dog-escape" : ""}`} aria-hidden="true">
      <div className="dog">
        <Image
          className="dog-image"
          src="/dachshund.png"
          alt=""
          width={442}
          height={242}
          priority
        />
        {escaping ? <div className="stolen-bone">NIE</div> : null}
      </div>
    </div>
  );
}
