export default function ProductImage() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 70, height: 70, color: "#d1d5db" }}
    >
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="38" cy="40" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 70 L35 50 L52 65 L65 55 L85 70"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
