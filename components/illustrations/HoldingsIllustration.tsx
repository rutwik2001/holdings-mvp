import React from "react";
import Coin from "./Coin";
import Wallet from "./Wallet";

const HoldingsIllustration = () => (
  <div style={{ position: "relative", width: 241, height: 157 }}>
    <div
    className="absolute top-1/2 left-1/2 z-[1]"
    style={{ transform: "translate(-50%, -150px) translateX(0px)" }}
    >
        <Coin />
    </div>
    <div style={{ position: "absolute", zIndex: 2, top: 0, left: 0 }}>
      <Wallet />
    </div>
  </div>
);

export default HoldingsIllustration;
