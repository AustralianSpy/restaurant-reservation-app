import React, { useEffect, useState, useMemo } from "react";
import { searchReservations } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import ReservationDetails from "../reservations/ReservationDetails";

export default function Search() {
  // -------> STORE RESERVATIONS FOUND AND ERRORS.
  const [reservations, setReservations] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------> HANDLE MOBILE NUMBER IN URL QUERY, SET WITH USE-EFFECT, OR THROUGH INPUT.
  const [mobileNumber, setMobileNumber] = useState(null);
  const query = useQuery().get("mobile_number");
  
  useEffect(() => { if (query) setMobileNumber(query) }, [query]);

  // --------> FORM HANDLERS.
  const handleSubmit = (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    setReservationsError(null);
    setIsLoading(true);
  
    searchReservations(mobileNumber, abortController.signal)
      .then(setReservations)
      .then(() => setIsLoading(false))
      .catch(setReservationsError); 
    
    return () => abortController.abort();
  }

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };  

  // --------> DISPLAY SKELETON IF LOADING.
  const reservationsLoader = useMemo(() => {
    const skeleton = [];
    for (let i = 0; i < 2; i++) {
      skeleton.push(
        <div className="card mb-3" key={`skeleton ${i}`}>
          <div className="card-header"><Skeleton /></div>
          <div className="list-group list-group-flush">
              <li className="list-group-item"><Skeleton /></li>
              <li className="list-group-item"><Skeleton /></li>
              <li className="list-group-item"><Skeleton /></li>
          </div>
          <div className="card-body d-flex flex-row">
              <p className="text-uppercase fw-bold align-self my-auto"><Skeleton /></p>
              <div><Skeleton /></div>
          </div>
      </div>
      );
    }
    return skeleton;
  }, []);

  // --------> CHOOSE WHICH COMPONENTS TO RENDER.
  const renderSearch = () => {
    if (mobileNumber === null) {
      return null;
    } else if (reservations?.length > 0) {
        return <ReservationDetails reservations={reservations} searching={true} />
    } else if (reservations?.length === 0) {
      return <h3>No reservations found.</h3>
    }
}

  return (
    <main>
        <h1 className="text-center m-0 pb-2 pt-4" style={{ backgroundColor: "var(--yellow)" }}>Search for existing reservation</h1>
        <div className="svg-border">
          <svg id="visual" viewBox="0 0 960 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="960" height="540" fill="#F4F1DE"></rect><path d="M0 72L22.8 71.2C45.7 70.3 91.3 68.7 137 68C182.7 67.3 228.3 67.7 274 66.8C319.7 66 365.3 64 411.2 63.3C457 62.7 503 63.3 548.8 65.8C594.7 68.3 640.3 72.7 686 71.8C731.7 71 777.3 65 823 62.3C868.7 59.7 914.3 60.3 937.2 60.7L960 61L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#e07a5f"></path><path d="M0 43L22.8 43.3C45.7 43.7 91.3 44.3 137 44.3C182.7 44.3 228.3 43.7 274 43.5C319.7 43.3 365.3 43.7 411.2 46.7C457 49.7 503 55.3 548.8 54.8C594.7 54.3 640.3 47.7 686 45.3C731.7 43 777.3 45 823 46.7C868.7 48.3 914.3 49.7 937.2 50.3L960 51L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#e79669"></path><path d="M0 28L22.8 29.3C45.7 30.7 91.3 33.3 137 35.7C182.7 38 228.3 40 274 40.8C319.7 41.7 365.3 41.3 411.2 41.3C457 41.3 503 41.7 548.8 39.7C594.7 37.7 640.3 33.3 686 32C731.7 30.7 777.3 32.3 823 32.2C868.7 32 914.3 30 937.2 29L960 28L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#edb279"></path><path d="M0 17L22.8 16.5C45.7 16 91.3 15 137 15.5C182.7 16 228.3 18 274 19.3C319.7 20.7 365.3 21.3 411.2 20.8C457 20.3 503 18.7 548.8 18.8C594.7 19 640.3 21 686 21.5C731.7 22 777.3 21 823 20C868.7 19 914.3 18 937.2 17.5L960 17L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#f2cc8f"></path></svg>
        </div>
        
        <section className="d-md-flex flex-column mb-3 px-2" id="search form">
            <form className="d-flex flex-row form-group" onSubmit={handleSubmit}>
              <input
                className="form-control"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
              />
              <button className="btn btn-primary ml-3" type="submit">Find</button>
            </form>
        </section>
        <section className="d-md-flex flex-column mt-3 pt-4 border-top" id="reservations">
            <ErrorAlert error={reservationsError} />
            { isLoading ?
                reservationsLoader :
                renderSearch() 
            }
        </section>
    </main>
  );
}