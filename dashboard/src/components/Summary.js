import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Summary = () => {
  const { user, funds, portfolioVersion } = useContext(GeneralContext);
  const [holdings, setHoldings] = useState([]);

  const fetchHoldings = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/allHoldings`)
      .then((res) => {
        if (res.data) setHoldings(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings, portfolioVersion]);

  const totalInvestment = holdings.reduce(
    (acc, s) => acc + (s.avg || 0) * (s.qty || 0),
    0
  );
  const currentValue = holdings.reduce(
    (acc, s) => acc + (s.price || 0) * (s.qty || 0),
    0
  );
  const totalPL = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const isProfit = totalPL >= 0;

  const availableMargin = funds?.availableMargin ?? 25000;
  const usedMargin = funds?.usedMargin ?? 0;
  const openingBalance = funds?.openingBalance ?? 25000;

  return (
    <>
      <div className="username">
        <h6>Hi, {user?.username || "Trader"}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{availableMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{usedMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>{" "}
            </p>
            <p>
              Opening balance <span>₹{openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={isProfit ? "profit" : "loss"}>
              ₹{totalPL.toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
              <small>({pnlPercent >= 0 ? `+${pnlPercent.toFixed(2)}%` : `${pnlPercent.toFixed(2)}%`})</small>
            </h3>
            <p>Total P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>{" "}
            </p>
            <p>
              Investment <span>₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
