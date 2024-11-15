import React from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div>NextJS</div>
      <DynamicWidget />
    </div>
  );
};

export default Header;
