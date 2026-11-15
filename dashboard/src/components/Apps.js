import React from "react";

const appsList = [
  {
    name: "Smallcase",
    desc: "Thematic investment platform that helps you invest in diversified baskets of stocks and ETFs.",
    category: "Investments",
    tag: "Trending",
  },
  {
    name: "Streak",
    desc: "Systematic trading platform for retail investors. Plan, create, and backtest trading strategies without coding.",
    category: "Algo Trading",
    tag: "Pro",
  },
  {
    name: "Sensibull",
    desc: "Options trading platform for Indian markets with strategy builders, Greeks analysis, and real-time alerts.",
    category: "Options",
    tag: "Popular",
  },
  {
    name: "GoldenPi",
    desc: "India's first online platform for investing in bonds, NCDs, and corporate fixed deposits.",
    category: "Fixed Income",
    tag: "Bonds",
  },
  {
    name: "Ditto",
    desc: "Personalized insurance advisory platform to help you buy life and health insurance with zero spam.",
    category: "Insurance",
    tag: "Advisory",
  },
];

const Apps = () => {
  return (
    <div style={{ padding: "10px 0" }}>
      <h3 className="title" style={{ marginBottom: "8px" }}>Zerodha Ecosystem Apps</h3>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "24px" }}>
        Extend your trading experience with our verified partner platforms and developer tools.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {appsList.map((app, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e6e6e6",
              borderRadius: "6px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>{app.name}</h4>
                <span
                  style={{
                    backgroundColor: "#f0f4ff",
                    color: "#387ed1",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {app.tag}
                </span>
              </div>
              <p style={{ color: "#777", fontSize: "0.85rem", lineHeight: "1.5", margin: 0 }}>
                {app.desc}
              </p>
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#999" }}>{app.category}</span>
              <button
                type="button"
                onClick={() => alert(`Redirecting to ${app.name} partner portal...`)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #387ed1",
                  color: "#387ed1",
                  borderRadius: "4px",
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Launch
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
