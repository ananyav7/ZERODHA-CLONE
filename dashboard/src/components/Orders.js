import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { API_BASE_URL } from "../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { portfolioVersion } = useContext(GeneralContext);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/allOrders`)
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.warn("Could not fetch orders from backend:", err);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, portfolioVersion]);

  if (loading) {
    return (
      <div className="orders">
        <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 className="title" style={{ margin: 0 }}>Orders ({orders.length})</h3>
        <button
          type="button"
          onClick={fetchOrders}
          style={{
            padding: "6px 14px",
            border: "1px solid #d3d3d3",
            backgroundColor: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Refresh Orders
        </button>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const modeClass = order.mode === "BUY" ? "profit" : "loss";
              return (
                <tr key={order._id || index}>
                  <td>{index + 1}</td>
                  <td><strong>{order.name}</strong></td>
                  <td>{order.qty}</td>
                  <td>₹{Number(order.price || 0).toFixed(2)}</td>
                  <td className={modeClass}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "3px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        backgroundColor: order.mode === "BUY" ? "#e8f5e9" : "#ffebee",
                        color: order.mode === "BUY" ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {order.mode || "BUY"}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#2e7d32", fontSize: "0.85rem", fontWeight: "500" }}>
                      COMPLETE
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
