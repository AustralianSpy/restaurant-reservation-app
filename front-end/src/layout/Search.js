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
        return <ReservationDetails reservations={reservations} />
    } else if (reservations?.length === 0) {
      return <h3>No reservations found.</h3>
    }
}

  return (
    <main>
        <h1 className="text-center my-3 mb-3 border-bottom pb-4">Search for existing reservation:</h1>
        <section className="d-md-flex flex-column mb-3" id="search form">
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