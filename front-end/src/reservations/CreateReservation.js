import React, { useState } from "react";
import ReservationsForm from "../components/ReservationsForm";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateReservation() {
    // --------> SET STATE OF RESERVATION.
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }
    const [reservation, setReservation] = useState({ ...initialFormState });

    // --------> ERROR AND HANDLER TO PASS ONTO FORM.
    const [reservationError, setReservationError] = useState(null);
    const handleError = (error) => {
        setReservationError(error);
    }

    // --------> FORM HANDLERS.
    const handleChange = ({ target }) => {
        let { value } = target;
        if (target.name === "people") value = Number(target.value);
        
        setReservation({
            ...reservation,
            [target.name]: value,
        });
    };

    return (
        <div className="container mb-5">
            <h2 className="my-3">Create a reservation:</h2>
            <ErrorAlert error={reservationError} />
            <ReservationsForm reservation={reservation} handleChange={handleChange} handleError={handleError} />
        </div>
    );
}