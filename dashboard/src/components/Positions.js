import React, { useState, useEffect } from "react";
import axios from "axios";

import { positions as defaultPositions } from "../data/data";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/allPositions`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAllPositions(res.data);
        } else {
          setAllPositions(defaultPositions);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch positions from backend, using default data:", err);
        setAllPositions(defaultPositions);
      });
  }, []);

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const isProfit = curValue - (stock.avg || 0) * (stock.qty || 0) >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.product || "CNC"}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{Number(stock.avg || 0).toFixed(2)}</td>
                  <td>{Number(stock.price || 0).toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - (stock.avg || 0) * (stock.qty || 0)).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day || stock.net || "0.00%"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
