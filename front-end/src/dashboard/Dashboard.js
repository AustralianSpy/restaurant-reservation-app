import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";

import ReservationDetails from "../reservations/ReservationDetails";
import TableDetails from "../tables/TableDetails";
import BorderBotYellow from "../components/BorderBotYellow";
import BorderBotGreen from "../components/BorderBotGreen";
import BorderTopGreen from "../components/BorderTopGreen";

import { useReservationsLoader, useTablesLoader } from "../utils/useSkeletonLoader";

import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  // --------> FETCH MANUALLY-ENTERED DATE.
  const history = useHistory();
  const query = useQuery().get("date");
  if (query) date = query;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
  
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError); 

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    
    return () => abortController.abort();
  }

  // --------> HANDLERS FOR DATE-NAVIGATION BUTTONS.
  const handlePreviousDate = () => {
    history.push(`dashboard?date=${previous(date)}`);
  }

  const handleNextDate = () => {
    history.push(`dashboard?date=${next(date)}`);
  }

  const handleCurrentDate = () => {
    history.push(`dashboard?date=${today()}`);
  }

  // --------> SKELETON LOADERS.
  const reservationsLoader = useReservationsLoader();
  const tablesLoader = useTablesLoader();

  return (
    <main>

      <div className="title-header">
        <h1 className="dashboard-title m-0 pb-0 pt-4">Your Dashboard</h1>
        <BorderBotYellow />
      </div>

      <section className="d-flex flex-column mb-3 mt-0 p-0" id="reservations">
        <h4 className="text-center text-uppercase p-0 my-0 section-title">Reservations for <span className="date-text">{date}</span>:</h4>
        <BorderBotGreen />

        <ErrorAlert error={reservationsError} />
        {
          reservations ?
            <ReservationDetails reservations={reservations} /> :
            reservationsLoader
        }

        <div className="btn-group date-nav mt-4" role="group">
          <button type="button" className="btn btn-primary" name="previous" onClick={handlePreviousDate} to={`/dashboard/date=${date}`}>
            <span className="bi bi-arrow-bar-left mr-1" />
            Previous Day
          </button>
          <button type="button" className="btn btn-secondary" name="today" onClick={handleCurrentDate} to={`/dashboard/date=${date}`}>Today</button>
          <button type="button" className="btn btn-primary" name="next" onClick={handleNextDate} to={`/dashboard/date=${date}`}>
            Next Day
            <span className="bi bi-arrow-bar-right ml-1" /></button>
        </div>
      </section>

      <section className="d-flex flex-column my-0" id="tables">
        <BorderTopGreen />
        <h4 className="text-center text-uppercase my-0 py-o section-title">All Tables:</h4>
        <BorderBotGreen />

          <ErrorAlert error={tablesError} />
          {
            tables ?
              <TableDetails tables={tables} /> : 
              tablesLoader
          }
        </section>
    </main>
  );
}

export default Dashboard;
