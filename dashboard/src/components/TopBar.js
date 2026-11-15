import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
  const [nifty, setNifty] = useState({ pts: 24158.35, chg: 82.4, pct: 0.34 });
  const [sensex, setSensex] = useState({ pts: 79486.20, chg: 215.1, pct: 0.27 });

  useEffect(() => {
    const timer = setInterval(() => {
      setNifty((prev) => {
        const delta = (Math.random() * 2 - 1) * 3.5;
        const pts = Number((prev.pts + delta).toFixed(2));
        const chg = Number((prev.chg + delta).toFixed(2));
        const pct = Number(((chg / pts) * 100).toFixed(2));
        return { pts, chg, pct };
      });

      setSensex((prev) => {
        const delta = (Math.random() * 2 - 1) * 10.2;
        const pts = Number((prev.pts + delta).toFixed(2));
        const chg = Number((prev.chg + delta).toFixed(2));
        const pct = Number(((chg / pts) * 100).toFixed(2));
        return { pts, chg, pct };
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{nifty.pts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className="percent" style={{ color: nifty.chg >= 0 ? "#2e7d32" : "#c62828", fontSize: "0.75rem", marginLeft: "6px" }}>
            {nifty.chg >= 0 ? `+${nifty.chg.toFixed(2)} (+${nifty.pct}%)` : `${nifty.chg.toFixed(2)} (${nifty.pct}%)`}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{sensex.pts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className="percent" style={{ color: sensex.chg >= 0 ? "#2e7d32" : "#c62828", fontSize: "0.75rem", marginLeft: "6px" }}>
            {sensex.chg >= 0 ? `+${sensex.chg.toFixed(2)} (+${sensex.pct}%)` : `${sensex.chg.toFixed(2)} (${sensex.pct}%)`}
          </p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
