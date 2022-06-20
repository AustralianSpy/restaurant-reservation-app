import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";

import ReservationDetails from "../reservations/ReservationDetails";
import TableDetails from "../tables/TableDetails";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  // --------> GENERATE LOAD-SKELETONS TO DISPLAY WHILE FETCHING.
  const tablesLoader = useMemo(() => {
    const skeleton = [];
    for (let i = 0; i < 2; i++) {
      skeleton.push(
        <div className="card mb-3 table-card" key={`skeleton ${i}`} >
          <div className="card-header">
            <Skeleton />
          </div>
          <div className="list-group list-group-flush">
            <li className="list-group-item"><Skeleton /></li>
            <li className="list-group-item text-uppercase status-row"><Skeleton /></li>
          </div>
        </div>
      );
    }
    return skeleton;
  }, []);

  const reservationsLoader = useMemo(() => {
    const skeleton = [];
    for (let i = 0; i < 2; i++) {
      skeleton.push(
        <div className="card mb-3 reservation-card" key={`skeleton ${i}`}>
          <div className="card-header"><Skeleton /></div>
          <div className="list-group list-group-flush d-flex flex-row">
              <li className="list-group-item"><Skeleton /></li>
              <li className="list-group-item"><Skeleton /></li>
              <li className="list-group-item"><Skeleton /></li>
          </div>
          <div className="card-body d-flex flex-row justify-content-between py-2">
              <p className="text-uppercase fw-bold align-self my-auto"><Skeleton /></p>
              <div><Skeleton /></div>
          </div>
      </div>
      );
    }
    return skeleton;
  }, []);

  return (
    <main>

      <h1 className="dashboard-title m-0 pb-1 pt-4">Your Dashboard</h1>
      <div className="svg-border">
        <svg id="visual" viewBox="0 0 960 75" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="960" height="540" fill="#81B29A"></rect><path d="M0 72L22.8 71.2C45.7 70.3 91.3 68.7 137 68C182.7 67.3 228.3 67.7 274 66.8C319.7 66 365.3 64 411.2 63.3C457 62.7 503 63.3 548.8 65.8C594.7 68.3 640.3 72.7 686 71.8C731.7 71 777.3 65 823 62.3C868.7 59.7 914.3 60.3 937.2 60.7L960 61L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#e07a5f"></path><path d="M0 43L22.8 43.3C45.7 43.7 91.3 44.3 137 44.3C182.7 44.3 228.3 43.7 274 43.5C319.7 43.3 365.3 43.7 411.2 46.7C457 49.7 503 55.3 548.8 54.8C594.7 54.3 640.3 47.7 686 45.3C731.7 43 777.3 45 823 46.7C868.7 48.3 914.3 49.7 937.2 50.3L960 51L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#e79669"></path><path d="M0 28L22.8 29.3C45.7 30.7 91.3 33.3 137 35.7C182.7 38 228.3 40 274 40.8C319.7 41.7 365.3 41.3 411.2 41.3C457 41.3 503 41.7 548.8 39.7C594.7 37.7 640.3 33.3 686 32C731.7 30.7 777.3 32.3 823 32.2C868.7 32 914.3 30 937.2 29L960 28L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#edb279"></path><path d="M0 17L22.8 16.5C45.7 16 91.3 15 137 15.5C182.7 16 228.3 18 274 19.3C319.7 20.7 365.3 21.3 411.2 20.8C457 20.3 503 18.7 548.8 18.8C594.7 19 640.3 21 686 21.5C731.7 22 777.3 21 823 20C868.7 19 914.3 18 937.2 17.5L960 17L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#f2cc8f"></path></svg>
      </div>

      <section className="d-flex flex-column mb-3 mt-0" id="reservations">
        <h4 className="text-center text-uppercase mt-0 pb-3 section-title">Reservations for <span className="date-text">{date}</span>:</h4>
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
        <h4 className="text-center text-uppercase mt-0 pb-3 section-title">All Tables:</h4>
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
