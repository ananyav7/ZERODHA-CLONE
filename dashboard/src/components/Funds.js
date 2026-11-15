import React, { useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Funds = () => {
  const { funds, user, refreshPortfolio } = useContext(GeneralContext);

  const availableMargin = funds?.availableMargin ?? 25000;
  const usedMargin = funds?.usedMargin ?? 0;
  const openingBalance = funds?.openingBalance ?? 25000;

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const amountStr = window.prompt("Enter amount to add to your trading account (₹):", "5000");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/funds/add`, {
        username: user?.username,
        amount,
      });
      alert(res.data.message || `₹${amount} added successfully!`);
      if (refreshPortfolio) refreshPortfolio();
    } catch (err) {
      console.error("Failed to add funds:", err);
      alert("Failed to add funds. Ensure backend is running.");
    }
  };

  const handleWithdrawFunds = async (e) => {
    e.preventDefault();
    const amountStr = window.prompt("Enter amount to withdraw (₹):", "1000");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/funds/withdraw`, {
        username: user?.username,
        amount,
      });
      alert(res.data.message || `₹${amount} withdrawn successfully!`);
      if (refreshPortfolio) refreshPortfolio();
    } catch (err) {
      console.error("Failed to withdraw funds:", err);
      const msg = err.response?.data?.error || "Withdrawal failed.";
      alert(msg);
    }
  };

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI & Netbanking</p>
        <button
          type="button"
          className="btn btn-green"
          onClick={handleAddFunds}
          style={{ cursor: "pointer", border: "none" }}
        >
          Add funds
        </button>
        <button
          type="button"
          className="btn btn-blue"
          onClick={handleWithdrawFunds}
          style={{ cursor: "pointer", border: "none" }}
        >
          Withdraw
        </button>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">
                ₹{availableMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">
                ₹{usedMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">
                ₹{availableMargin.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Total Collateral</p>
              <p>₹0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account active</p>
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => alert("Commodity segment activation requested! We will notify you once enabled.")}
              style={{ cursor: "pointer", border: "none" }}
            >
              Activate Commodity
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
