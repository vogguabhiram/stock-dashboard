import React from "react";
import { useParams } from "react-router-dom";

const StockDetails = () => {
  const { symbol } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{symbol} Chart</h1>

      <iframe
        src={`https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=5&theme=dark`}
        width="100%"
        height="500"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default StockDetails;