import React, { useState } from "react";
import BorderBotYellow from "../components/BorderBotYellow";
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
        <div className="container-fluid m-0 p-0">
            <h2 className="text-center text-uppercase m-0 pb-2 pt-4" style={{ backgroundColor: "var(--yellow)" }}>Create a reservation</h2>
            <BorderBotYellow />

            <ErrorAlert error={reservationError} />
            <div className="mb-5 px-2">
                <ReservationsForm reservation={reservation} handleChange={handleChange} handleError={handleError} />
            </div>
        </div>
    );
}