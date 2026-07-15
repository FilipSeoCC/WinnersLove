export default function Dachshund({ mood = "sweet", escaping = false }) {
  return (
    <div className={`dog-wrap ${mood === "happy" ? "dog-happy" : ""} ${escaping ? "dog-escape" : ""}`} aria-hidden="true">
      <div className="dog">
        <div className="tail" />
        <div className="body">
          <span className="spot spot-one" />
          <span className="spot spot-two" />
          <span className="body-shine" />
        </div>
        <div className="head">
          <div className="ear" />
          <div className="eyebrow" />
          <div className="eye">
            <span className="eye-shine" />
            <span className="eye-shine eye-shine-small" />
          </div>
          <div className="eyelash" />
          <div className="snout">
            <span className="snout-shine" />
          </div>
          <div className="nose">
            <span className="nose-shine" />
          </div>
          <div className="cheek" />
        </div>
        <div className="leg leg-one" />
        <div className="leg leg-two" />
        <div className="leg leg-three" />
        <div className="leg leg-four" />
        <div className="bow">{"♥"}</div>
        {escaping ? <div className="stolen-bone">NIE</div> : null}
      </div>
    </div>
  );
}
