import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

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

  const handlePreviousDate = () => {
    history.push(`dashboard?date=${previous(date)}`);
  }

  const handleNextDate = () => {
    history.push(`dashboard?date=${next(date)}`);
  }

  const handleCurrentDate = () => {
    history.push(`dashboard?date=${today()}`);
  }

  return (
    <main>

      <h1>Your Dashboard</h1>

      <section className="d-md-flex flex-column mb-3" id="reservations">
        <h4 className="mb-1">Reservations for {date}:</h4>
        <ErrorAlert error={reservationsError} />
        {(reservations.length > 0) ? JSON.stringify(reservations) : "No reservations this day."}
        {/*
          (reservations.length > 0) ? <ReservationsList reservations={reservations} /> : <h3>No reservations this day.</h3>
        */}
        <div className="button-group">
          <button className="btn btn-primary" name="previous" onClick={handlePreviousDate} to={`/dashboard/date=${date}`}>
            <span className="bi bi-arrow-bar-left" />
            Previous Day
          </button>
          <button className="btn btn-secondary" name="today" onClick={handleCurrentDate} to={`/dashboard/date=${date}`}>Today</button>
          <button className="btn btn-primary" name="next" onClick={handleNextDate} to={`/dashboard/date=${date}`}>
            Next Day
            <span className="bi bi-arrow-bar-right" /></button>
        </div>
      </section>

      <section className="d-md-flex flex-column mb-3" id="tables">
        <h4 className="mb-1">All Tables:</h4>
          <ErrorAlert error={tablesError} />
          {(tables.length > 0) ? JSON.stringify(tables) : "You have no registered tables."}
          {/*
            (tables.length > 0) ? <TablesList tables={tables} /> : <h3>You have no registered tables.</h3>
          */}
        </section>
    </main>
  );
}

export default Dashboard;
