import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import { holdings as defaultHoldings } from "../data/data";
import GeneralContext from "./GeneralContext";
import { API_BASE_URL } from "../config";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const { portfolioVersion } = useContext(GeneralContext);

  const fetchHoldings = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/allHoldings`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAllHoldings(res.data);
        } else {
          setAllHoldings(defaultHoldings);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch holdings from backend, using default data:", err);
        setAllHoldings(defaultHoldings);
      });
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings, portfolioVersion]);

  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + (stock.avg || 0) * (stock.qty || 0),
    0
  );
  const currentValue = allHoldings.reduce(
    (acc, stock) => acc + (stock.price || 0) * (stock.qty || 0),
    0
  );
  const totalPL = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const isTotalProfit = totalPL >= 0;

  const labels = allHoldings.map((subArray) => subArray.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 className="title" style={{ margin: 0 }}>Holdings ({allHoldings.length})</h3>
        <button
          type="button"
          onClick={fetchHoldings}
          style={{
            padding: "6px 14px",
            border: "1px solid #d3d3d3",
            backgroundColor: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Refresh
        </button>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const isProfit = curValue - (stock.avg || 0) * (stock.qty || 0) >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td><strong>{stock.name}</strong></td>
                  <td>{stock.qty}</td>
                  <td>₹{Number(stock.avg || 0).toFixed(2)}</td>
                  <td>₹{Number(stock.price || 0).toFixed(2)}</td>
                  <td>₹{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - (stock.avg || 0) * (stock.qty || 0)).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net || "+0.00%"}</td>
                  <td className={dayClass}>{stock.day || "+0.00%"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            ₹{totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            ₹{currentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={isTotalProfit ? "profit" : "loss"}>
            ₹{totalPL.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ({pnlPercent >= 0 ? `+${pnlPercent.toFixed(2)}%` : `${pnlPercent.toFixed(2)}%`})
          </h5>
          <p>Total P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
