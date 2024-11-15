import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div>NextJS</div>
      <ConnectButton />
    </div>
  );
};

export default Header;
