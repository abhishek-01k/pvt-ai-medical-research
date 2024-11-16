"use client";
import React from "react";
import WorldWidget from "./WorldWidget";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div>NextJS</div>
      <WorldWidget />
      {/* <DynamicWidget /> */}
      <ConnectButton />
    </div>
  );
};

export default Header;
