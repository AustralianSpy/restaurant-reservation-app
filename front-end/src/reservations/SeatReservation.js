import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { readReservation, listTables, reserveTable } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";

/*
    Fetches a single reservation, list of tables.
    Render cases:
        1) Full success. Allows selection of a table for seating.
        2) Partial success. Fetched reservation but there are no registered tables. Display warning and force user to go back.
        3) Full failure. There is no reservation with that id. Display warning and force user to go back.
*/

export default function SeatReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [reservation, setReservation] = useState({});
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState(null);

    const [error, setError] = useState(null);

    // ON LOAD:
    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setError(null);
    
        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError); 

        listTables(abortController.signal)
            .then(setTables)
            .catch(setError);
        
        return () => abortController.abort();
    }

    // FORM HANDLERS:
    const handleChange = ({ target }) => {
        setForm(target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        const abortController = new AbortController();
        const submitData = async () => {
            try {
                await reserveTable({ table_id: form, reservation_id: reservation_id}, abortController.signal);
                history.push('/dashboard');
            } catch (e) {
                if (e.name === "AbortedError") {
                    console.log("Aborted request.");
                } else {
                    setError(e);
                    throw e;
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

    if (Object.keys(reservation).length > 0 && tables.length > 0) {
        return (
            <main className="mt-3">
                <h1 className="mb-4">Now seating table for {`${reservation.first_name} ${reservation.last_name}`}</h1>
                <form onSubmit={handleSubmit} aria-label="seating form">
                <div className="form-group">
                    <label htmlFor="table_id" className="text-uppercase font-weight-bold">Please select a table:</label>
                    <select name="table_id" id="table_id" placeholder="Table - Capacity" className="form-control" onChange={handleChange} required>
                        {
                            tables.map((table) => <option value={table.table_id}>{table.table_name} - {table.capacity}</option>)
                        }
                    </select>
                </div>
                <div className="form-group">
                    <button className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
            </main>
        )
    } else if (!tables.length) {
        return (
            <main className="mt-3">
                <div className="d-flex flex-column">
                    <div className="alert alert-secondary" role="alert">
                        WARNING: You must register at least one (1) table in order to seat a reservation.
                    </div>
                    <button className="btn btn-warning text-uppercase col-6 mx-auto" onClick={()=>history.goBack()}>Go back</button>
                </div>
            </main>
        );
    } else {
        return (
            <main className="mt-3">
                <div className="d-flex flex-column">
                    <ErrorAlert error={error} />
                    <button className="btn btn-warning text-uppercase col-6 mx-auto" onClick={()=>history.goBack()}>Go back</button>
                </div>
            </main>
        );
    }
}