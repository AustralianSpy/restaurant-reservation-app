import React, { useEffect, useState, useMemo } from "react";
import { searchReservations } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";

import ReservationDetails from "../reservations/ReservationDetails";
import BorderBotYellow from "../components/BorderBotYellow";
import { useReservationsLoader } from "../utils/useSkeletonLoader";

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
  const reservationsLoader = useReservationsLoader();

  // --------> CHOOSE WHICH COMPONENTS TO RENDER.
  const renderSearch = () => {
    if (mobileNumber === null || mobileNumber.length === 0) {
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
        <BorderBotYellow />
        
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