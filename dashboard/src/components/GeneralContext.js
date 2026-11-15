import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import { API_BASE_URL } from "../config";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, price) => {},
  closeSellWindow: () => {},
  refreshPortfolio: () => {},
  portfolioVersion: 0,
  user: null,
  funds: { availableMargin: 25000, usedMargin: 0, openingBalance: 25000 },
  updateFunds: (newFunds) => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedBuyStockUID, setSelectedBuyStockUID] = useState("");
  const [selectedBuyPrice, setSelectedBuyPrice] = useState(0);

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellStockUID, setSelectedSellStockUID] = useState("");
  const [selectedSellPrice, setSelectedSellPrice] = useState(0);

  const [portfolioVersion, setPortfolioVersion] = useState(0);

  // Load user from localStorage or fallback to default demo user
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("zerodha_user");
      return stored ? JSON.parse(stored) : { username: "demo_trader", email: "demo@zerodha.clone" };
    } catch {
      return { username: "demo_trader", email: "demo@zerodha.clone" };
    }
  });

  const [funds, setFunds] = useState({
    availableMargin: 25000,
    usedMargin: 0,
    openingBalance: 25000,
  });

  const fetchUserFunds = useCallback(() => {
    if (!user?.username) return;
    axios
      .get(`${API_BASE_URL}/user/${user.username}`)
      .then((res) => {
        if (res.data?.funds) {
          setFunds(res.data.funds);
        }
      })
      .catch(() => {
        // use default state if not found
      });
  }, [user]);

  useEffect(() => {
    fetchUserFunds();
  }, [fetchUserFunds, portfolioVersion]);

  const refreshPortfolio = () => {
    setPortfolioVersion((v) => v + 1);
  };

  const handleOpenBuyWindow = (uid, price = 0) => {
    setIsSellWindowOpen(false);
    setIsBuyWindowOpen(true);
    setSelectedBuyStockUID(uid);
    setSelectedBuyPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedBuyStockUID("");
    setSelectedBuyPrice(0);
  };

  const handleOpenSellWindow = (uid, price = 0) => {
    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(true);
    setSelectedSellStockUID(uid);
    setSelectedSellPrice(price);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedSellStockUID("");
    setSelectedSellPrice(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        refreshPortfolio,
        portfolioVersion,
        user,
        setUser,
        funds,
        updateFunds: setFunds,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedBuyStockUID}
          defaultPrice={selectedBuyPrice}
        />
      )}
      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedSellStockUID}
          defaultPrice={selectedSellPrice}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
