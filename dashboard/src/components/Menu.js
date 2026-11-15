import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, funds, setUser } = useContext(GeneralContext);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setIsProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("zerodha_user");
    setUser({ username: "demo_trader", email: "demo@zerodha.clone" });
    setIsProfileDropdownOpen(false);
    alert("Logged out. Switched to demo account.");
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const username = user?.username || "USERID";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="menu-container" style={{ position: "relative" }}>
      <img src="logo.png" alt="Zerodha Kite Logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div
          className="profile"
          onClick={handleProfileClick}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="avatar">{initials}</div>
          <p className="username">{username.toUpperCase()}</p>

          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "0",
                width: "240px",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                borderRadius: "4px",
                padding: "16px",
                zIndex: 1000,
                textAlign: "left",
                color: "#444",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
                <strong style={{ fontSize: "1rem", color: "#222" }}>{username}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#888" }}>
                  {user?.email || "trader@zerodha.clone"}
                </p>
              </div>

              <div style={{ fontSize: "0.85rem", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#666" }}>Margin:</span>
                  <strong>₹{funds?.availableMargin?.toFixed(2) ?? "25000.00"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Segment:</span>
                  <span style={{ color: "#2e7d32", fontWeight: 600 }}>NSE / BSE</span>
                </div>
              </div>

              <hr style={{ margin: "10px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a
                  href={FRONTEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.85rem",
                    color: "#387ed1",
                    textDecoration: "none",
                  }}
                >
                  Zerodha Website &rarr;
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                    color: "#df514c",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Reset / Switch Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
