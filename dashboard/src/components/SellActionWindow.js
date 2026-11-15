import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { API_BASE_URL } from "../config";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, defaultPrice = 0 }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(defaultPrice || 100);
  const { closeSellWindow, refreshPortfolio, user } = useContext(GeneralContext);

  const handleSellClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/newOrder`, {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "SELL",
        username: user?.username,
      });

      alert(res.data.message || `Sold ${stockQuantity} shares of ${uid}`);
      closeSellWindow();
      if (refreshPortfolio) refreshPortfolio();
    } catch (err) {
      console.error("Failed to place sell order:", err);
      const msg = err.response?.data?.error || "Failed to place sell order. Ensure you own enough shares.";
      alert(msg);
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true" style={{ borderColor: "#df514c" }}>
      <div style={{ backgroundColor: "#df514c", color: "#fff", padding: "12px 18px", borderRadius: "4px 4px 0 0" }}>
        <h4 style={{ margin: 0, fontSize: "1rem" }}>
          Sell {uid} <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>NSE x 1 Qty</span>
        </h4>
      </div>

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Estimated proceeds: ₹{(Number(stockQuantity) * Number(stockPrice || 0)).toFixed(2)}</span>
        <div>
          <button type="button" className="btn btn-red" onClick={handleSellClick}>
            Sell
          </button>
          <button type="button" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
