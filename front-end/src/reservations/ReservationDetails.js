import React from "react";

export default function ReservationDetails({ reservations }) {
    const formatTime = (reservation_time) => {
        const hours = Number(reservation_time.substr(0, 2));
            const minutes = reservation_time.substr(2, 4);

            if (hours > 12) {
                return `${hours-12}${minutes} PM`;
            } else if (hours === 12) {
                return `${hours}${minutes} PM`;
            } else {
                return `${reservation_time.substr(1,1)}${minutes} AM`;
            }
    };
    
    return reservations.map((reservation) => {
        const {first_name, last_name, reservation_time, people, mobile_number, reservation_id, status } = reservation;
        const time = formatTime(reservation_time);
        if (status !== "finished") return (
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
                    { (status === 'booked') ? <a href={`/reservations/${reservation_id}/seat`} className="btn btn-success ml-3">Seat</a> : null }
                </div>
            </div>
        )
    });
}