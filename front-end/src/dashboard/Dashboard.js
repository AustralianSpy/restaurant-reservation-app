import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
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
  
  const history = useHistory();
  const query = useQuery().get("date");
  if (query) date = query;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
  
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
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
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}:</h4>
      </div>
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
      <ErrorAlert error={reservationsError} />
      {(reservations.length > 0) ? JSON.stringify(reservations) : "No reservations this day."}
    </main>
  );
}

export default Dashboard;
