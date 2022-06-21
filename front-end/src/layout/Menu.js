import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-dark navbar-expand-md align-items-start p-0">
      <div className="container-fluid d-flex flex-md-column py-2 px-0 align-items-start">
        <Link
              className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand my-0 my-md-2"
              to="/"
            >
          <div className="sidebar-brand-text mx-3">
            <span className="text-uppercase">Periodic Tables</span>
          </div>
        </Link>
        <hr className="sidebar-divider m-1" />
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse py-0 pl-2 pr-0" id="navbarToggler">
          <ul className="nav navbar-nav text-light d-flex flex-column align-items-end align-items-md-start" id="accordionSidebar">
            <li className="nav-item mb-1">
              <Link className="nav-link" to="/dashboard">
                <span className="oi oi-dashboard mr-2" />
                &nbsp;Dashboard
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link className="nav-link" to="/search">
                <span className="oi oi-magnifying-glass mr-2" />
                &nbsp;Search
              </Link>
            </li>
            <li className="nav-item mb-1">
              <Link className="nav-link" to="/reservations/new">
                <span className="oi oi-plus mr-2" />
                &nbsp;New Reservation
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tables/new">
                <span className="oi oi-layers mr-2" />
                &nbsp;New Table
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
