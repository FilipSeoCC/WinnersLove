import Image from "next/image";

const MOOD_IMAGES = {
  sweet: { src: "/dachshund-sweet.png", width: 265, height: 248 },
  happy: { src: "/dachshund-happy.png", width: 449, height: 422 },
  sad: { src: "/dachshund-sad.png", width: 485, height: 210 }
};

export default function Dachshund({ mood = "sweet", escaping = false }) {
  const image = MOOD_IMAGES[mood] || MOOD_IMAGES.sweet;

  return (
    <div className={`dog-wrap ${mood === "happy" ? "dog-happy" : ""} ${escaping ? "dog-escape" : ""}`} aria-hidden="true">
      <div className="dog">
        <Image
          className="dog-image"
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          priority
        />
        {escaping ? <div className="stolen-bone">NIE</div> : null}
      </div>
    </div>
  );
}
