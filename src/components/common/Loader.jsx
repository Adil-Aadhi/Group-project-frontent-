import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-screen">
      <div className="loader-glass">
        <svg className="loader-ring" viewBox="0 0 100 100">
          {/* Track — the empty glass tube */}
          <circle
            className="loader-track"
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
          />
          {/* Fill — animates around the tube like liquid filling it */}
          <circle
            className="loader-fill"
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
        <div className="loader-glow"></div>
      </div>
    </div>
  );
};

export default Loader;