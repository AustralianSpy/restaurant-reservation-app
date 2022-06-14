import React, { useEffect, useState } from "react";
import { searchReservations } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";

import ReservationDetails from "../reservations/ReservationDetails";

export default function Search() {
  // -------> STORE RESERVATIONS FOUND AND ERRORS.
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // -------> HANDLE MOBILE NUMBER IN URL QUERY, SET WITH USE-EFFECT, OR THROUGH INPUT.
  const [mobileNumber, setMobileNumber] = useState(null);
  const query = useQuery().get("mobile_number");
  
  useEffect(() => {
    if (query) setMobileNumber(query);
  }, [query]);

  // --------> FORM HANDLERS.
  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };  

  const handleSubmit = () => {
    const abortController = new AbortController();
    setReservationsError(null);
  
    searchReservations({ mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError); 
    
    return () => abortController.abort();
  }

  // --------> CHOOSE WHICH COMPONENTS TO RENDER.
  const renderSearch = () => {
    if (mobileNumber === null) {
      return null;
    } else if (reservations.length > 0) {
      return <ReservationDetails reservations={reservations} />
    } else {
      return <h3>No reservations found.</h3>
    }
  }

  return (
    <main>
        <h1 className="text-center my-3 mb-3 border-bottom pb-4">Search for existing reservation:</h1>
        <section className="d-md-flex flex-column mb-3" id="search form">
            <form className="d-flex flex-row" onSubmit={handleSubmit}>
              <input
                className="form-control"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
              />
              <button className="btn btn-primary ml-3" type="button">Find</button>
            </form>
        </section>
        <section className="d-md-flex flex-column mt-3 pt-4 border-top" id="reservations">
            <ErrorAlert error={reservationsError} />
            { renderSearch() }
        </section>
    </main>
  );
}