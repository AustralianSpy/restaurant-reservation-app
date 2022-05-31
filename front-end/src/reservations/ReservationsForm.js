import React from "react";
import { useHistory, useRouteMatch } from "react-router";

export default function ReservationsForm() {
    const history = useHistory();
    const { path } = useRouteMatch();
    const reservation = "hello";
    // Use path to determine what heading / form content to render.

    const handleChange = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    return (
        <main>
            <h1>{(path === '/reservations/new') ? "Make a new reservation:" : "Edit your reservation:"}</h1>
            <form onSubmit={handleSubmit} aria-label="reservations form">
                <div className="form-group">
                    <label htmlFor="first_name" className="text-uppercase font-weight-bold">First Name:</label>
                    <input name="first_name" id="first_name" type="text" className="form-control" onChange={handleChange} value={reservation.first_name} />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name" className="text-uppercase font-weight-bold">Last Name:</label>
                    <input name="last_name" id="last_name" type="text" className="form-control" onChange={handleChange} value={reservation.last_name} />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile_number" className="text-uppercase font-weight-bold">Mobile Number:</label>
                    <input name="mobile_number" id="mobile_number" type="tel" className="form-control" onChange={handleChange} value={reservation.mobile_number} />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_date" className="text-uppercase font-weight-bold">Date of Reservation:</label>
                    <input name="reservation_date" id="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="form-control" onChange={handleChange} value={reservation.reservation_date} />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_time" className="text-uppercase font-weight-bold">Time of Reservation:</label>
                    <input name="reservation_time" id="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" className="form-control" onChange={handleChange} value={reservation.reservation_time} />
                </div>
                <div className="form-group">
                    <button className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
        </main>
    );
}