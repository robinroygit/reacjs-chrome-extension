import React from "react";
import "./popup.css";

const Popup = () => {
  return (
    <div>
      <h1 className="text-4xl text-green-500">hello</h1>
      <iframe
        src="https://kite.zerodha.com/dashboard"
        width="100%"
        height="600"
      ></iframe>
      {/* TESING  */}
      {/* <kite-button
        href="#"
        data-kite="5a70autepepei38k"
        data-exchange="NSE"
        data-tradingsymbol="SBIN"
        data-transaction_type="BUY"
        data-quantity="1"
        data-order_type="MARKET"
      >
        Buy SBI stock
      </kite-button> */}
    </div>
  );
};

export default Popup;
