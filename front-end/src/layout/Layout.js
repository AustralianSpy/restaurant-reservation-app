import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

function Layout() {
  return (
    <div className="container-fluid h-100">
      <div className="row" id="page-row">
        <div className="col-md-3 side-bar">
          <Menu />
        </div>
        <div className="col h-100 px-0">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
