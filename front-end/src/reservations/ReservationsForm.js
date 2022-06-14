import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

export default function ReservationsForm() {
    // --------> USE PATH TO DETERMINE WHAT HEADING / FORM CONTENT TO RENDER.
    const history = useHistory();
    const { path } = useRouteMatch();

    // --------> SET STATE OF RESERVATION AND ERRORS.
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }
    const [reservation, setReservation] = useState({ ...initialFormState });
    const [reservationError, setReservationError] = useState(null);
    
    // --------> FORM HANDLERS.
    const handleChange = ({ target }) => {
        let { value } = target;
        if (target.name === "people") value = Number(target.value);
        
        setReservation({
            ...reservation,
            [target.name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setReservationError(null);
        const abortController = new AbortController();
        const submitData = async () => {
            if (path === "/reservations/new"){
                try {
                    await createReservation(reservation, abortController.signal);
                    history.push(`/dashboard?date=${reservation.reservation_date}`)
                } catch (error) {
                    if (error.name === "AbortedError") {
                        console.log("Aborted request.");
                    } else {
                        setReservationError(error);
                        throw error;
                    }
                }
            } else if (path === "/reservations/edit"){
                try {
                    // update existing reservation here
                } catch (error) {
                    throw error;
                }
            }
        }
        submitData();

        return () => { abortController.abort() };
    };

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    // Commented out inputs are cross-browser compatible, however were not compatible with the assessment tests.
    return (
        <main>
            <h1>{(path === "/reservations/new") ? "Make a new reservation:" : "Edit your reservation:"}</h1>
            <ErrorAlert error={reservationError} />
            <form onSubmit={handleSubmit} aria-label="reservations form">
                <div className="form-group">
                    <label htmlFor="first_name" className="text-uppercase font-weight-bold">First Name:</label>
                    <input name="first_name" id="first_name" type="text" className="form-control" onChange={handleChange} value={reservation.first_name} required />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name" className="text-uppercase font-weight-bold">Last Name:</label>
                    <input name="last_name" id="last_name" type="text" className="form-control" onChange={handleChange} value={reservation.last_name} required  />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile_number" className="text-uppercase font-weight-bold">Mobile Number:</label>
                    <input name="mobile_number" id="mobile_number" type="tel" placeholder="###-###-####" className="form-control" onChange={handleChange} value={reservation.mobile_number} required />
                    { /* <input name="mobile_number" id="mobile_number" type="tel" placeholder="###-###-####" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="form-control" onChange={handleChange} value={reservation.mobile_number} required /> */ }
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_date" className="text-uppercase font-weight-bold">Date of Reservation:</label>
                    <input name="reservation_date" id="reservation_date" type="date" placeholder="YYYY-MM-DD" className="form-control" onChange={handleChange} value={reservation.reservation_date} required />
                    { /* <input name="reservation_date" id="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="form-control" onChange={handleChange} value={reservation.reservation_date} required /> */ }
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_time" className="text-uppercase font-weight-bold">Time of Reservation:</label>
                    <input name="reservation_time" id="reservation_time" type="time" className="form-control" onChange={handleChange} value={reservation.reservation_time} required />
                    { /* <input name="reservation_time" id="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" className="form-control" onChange={handleChange} value={reservation.reservation_time} required /> */ }
                </div>
                <div className="form-group">
                    <label htmlFor="people" className="text-uppercase font-weight-bold">Number of People:</label>
                    <input name="people" id="people" type="number" className="form-control" onChange={handleChange} value={reservation.people} required />
                </div>
                <div className="form-group">
                    <button className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
        </main>
    );
}