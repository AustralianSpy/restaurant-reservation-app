import React, { useState, useMemo } from "react";
import { useHistory } from "react-router";
import { cancelReservation } from "../utils/api";

export default function ReservationDetails({ reservations }) {
    const [reservationId, setReservationId] = useState(null);
    const history = useHistory();

    
    // -------->  FORMAT TIME FOR DISPLAY AS APPROPRIATE STRING.
    const formatTime = (reservation_time) => {
        const hours = Number(reservation_time.substr(0, 2));
        const minutes = reservation_time.substr(2, 4);

            if (hours > 12) {
                return `${hours-12}${minutes} PM`;
            } else if (hours === 12) {
                return `${hours}${minutes} PM`;
            } else if (hours === 11) {
                return `${hours}${minutes} AM`;
            } else {
                return `${reservation_time.substr(1,1)}${minutes} AM`;
            }
    };

    // --------> HOLD ID OF TABLE USER IS ATTEMPTING TO FINISH.
    const handleSetId = (reservation_id) => {
        setReservationId(reservation_id);
    }

    // --------> HANDLES THE CANCELLATION OF A RESERVATION.
    const handleCancel = (event) => {
        event.preventDefault();
        
        const abortController = new AbortController();
        const submitData = async () => {
            try {
                await cancelReservation(reservationId, abortController.signal);
                history.go("/");
            } catch (error) {
                if (error.name === "AbortedError") {
                    console.log("Aborted request.");
                } else {
                    throw error;
                }
            }
        }
        submitData();

        return () => { abortController.abort() };
    }
    
    // --------> RENDER EACH RESERVATION.
    const reservationList = useMemo(() => {
        return reservations.map((reservation) => {
            const {first_name, last_name, reservation_time, people, mobile_number, reservation_id, status } = reservation;
            const time = formatTime(reservation_time);
            return (
                <div className="card mb-3" key={reservation_id}>
                    <div className="card-header">
                        {first_name} {last_name}
                    </div>
                    <div className="list-group list-group-flush">
                        <li className="list-group-item">{time}</li>
                        <li className="list-group-item">{people === 1 ? "1 person" : `${people} people`}</li>
                        <li className="list-group-item">{mobile_number}</li>
                    </div>
                    <div className="card-body d-flex flex-row">
                        <p className="text-uppercase fw-bold align-self my-auto" data-reservation-id-status={reservation_id}>{status}</p>
                        { (status === 'booked') &&
                            <div>
                                <a href={`/reservations/${reservation_id}/seat`} className="btn btn-success ml-3">Seat</a>
                                <a href={`/reservations/${reservation_id}/edit`} className="btn btn-secondary ml-3">Edit</a>
                                <button
                                className="btn btn-danger ml-3"
                                data-toggle="modal" data-target="#cancelReservation"
                                aria-controls="finishTable"
                                aria-hidden="true" aria-label="toggle modal"
                                onClick={()=>handleSetId(reservation_id)}
                                data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>
                            </div>
                        }
                    </div>
                </div>
            )
        })
    }, [reservations]);

    if (reservations.length === 0) {
        return <h3>No reservations this day.</h3>;
    } else {
        return (
            <section>
                { reservationList }
    
                { /* MODAL PROMPT. Defaults to hidden until above button is clicked. */ }
                <div className="modal fade" id="cancelReservation" tabIndex="-1" aria-labelledby="cancelReservationLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="cancelReservationLabel">Cancelling Reservation...</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Do you want to cancel this reservation? This cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button className="btn btn-primary" data-method-name="accept" aria-label="accept" onClick={handleCancel}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}