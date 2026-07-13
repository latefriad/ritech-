export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "white",
            borderRadius: 14,
            border: "1.5px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: 1,
              background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div style={{ padding: 14 }}>
            <div
              style={{
                height: 14,
                width: "80%",
                background: "#f0f0f0",
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 14,
                width: "50%",
                background: "#f0f0f0",
                borderRadius: 4,
                marginBottom: 12,
              }}
            />
            <div
              style={{
                height: 36,
                width: "100%",
                background: "#f0f0f0",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
