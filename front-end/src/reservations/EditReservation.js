import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { readReservation } from "../utils/api";
import ReservationsForm from "../components/ReservationsForm";
import ErrorAlert from "../layout/ErrorAlert";
import BorderBotYellow from "../components/BorderBotYellow";

export default function EditReservation() {
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
    const { reservation_id } = useParams();

    // --------> ERROR AND HANDLER TO PASS ONTO FORM.
    const [reservationError, setReservationError] = useState(null);
    const handleError = (error) => {
        setReservationError(error);
    }

    // --------> FETCH INFORMATION FOR DECK.
    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const response = await readReservation(reservation_id, abortController.signal);
                if (response.status === "booked") {
                    setReservation(response);
                } else {
                    const error = new Error("A seated or cancelled reservation cannot be edited.")
                    error.status = 400;
                    setReservationError(error);
                }
            } catch (error) {
                setReservationError(error);
            }
        };

        fetchData();
        return () => { abortController.abort() };
    }, [reservation_id]);

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
            <h2 className="text-center text-uppercase m-0 pb-2 pt-4" style={{ backgroundColor: "var(--yellow)" }}>Edit your reservation</h2>
            <BorderBotYellow />

            <ErrorAlert error={reservationError} />
            <div className="mb-5 px-2">
             { reservationError === null && <ReservationsForm reservation={reservation} handleChange={handleChange} handleError={handleError} /> }
            </div>
        </div>
    );
}