import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function TablesForm() {
    // --------> USE PATH TO DETERMINE WHAT HEADING / FORM CONTENT TO RENDER.
    const history = useHistory();
    const { path } = useRouteMatch();

    // --------> SET STATE OF RESERVATION AND ERRORS.
    const initialFormState = {
        table_name: "",
        capacity: "",
    };
    const [table, setTable] = useState({ ...initialFormState });
    const [tableError, setTableError] = useState(null);
    

    const handleChange = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.value,
        });
    };

    // --------> FORM HANDLERS.
    const handleSubmit = (event) => {
        event.preventDefault();
        setTableError(null);
        const abortController = new AbortController();
        const submitData = async () => {
            if (path === "/tables/new"){
                try {
                    await createTable(table, abortController.signal);
                    history.push('/dashboard')
                } catch (error) {
                    if (error.name === "AbortedError") {
                        console.log("Aborted request.");
                    } else {
                        setTableError(error);
                        throw error;
                    }
                }
            } else if (path === "/tables/edit"){
                try {
                    // update existing table here
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

    // --------> RENDERS.
    return (
        <main>
            <h2 className="text-center text-uppercase m-0 pb-2 pt-4" style={{ backgroundColor: "var(--yellow)" }}>{(path === "/tables/new") ? "Add a new table" : "Edit an existing table"}</h2>
            <div className="svg-border">
                <svg id="visual" viewBox="0 0 960 100" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="960" height="540" fill="#F4F1DE"></rect><path d="M0 72L22.8 71.2C45.7 70.3 91.3 68.7 137 68C182.7 67.3 228.3 67.7 274 66.8C319.7 66 365.3 64 411.2 63.3C457 62.7 503 63.3 548.8 65.8C594.7 68.3 640.3 72.7 686 71.8C731.7 71 777.3 65 823 62.3C868.7 59.7 914.3 60.3 937.2 60.7L960 61L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#e07a5f"></path><path d="M0 43L22.8 43.3C45.7 43.7 91.3 44.3 137 44.3C182.7 44.3 228.3 43.7 274 43.5C319.7 43.3 365.3 43.7 411.2 46.7C457 49.7 503 55.3 548.8 54.8C594.7 54.3 640.3 47.7 686 45.3C731.7 43 777.3 45 823 46.7C868.7 48.3 914.3 49.7 937.2 50.3L960 51L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#e79669"></path><path d="M0 28L22.8 29.3C45.7 30.7 91.3 33.3 137 35.7C182.7 38 228.3 40 274 40.8C319.7 41.7 365.3 41.3 411.2 41.3C457 41.3 503 41.7 548.8 39.7C594.7 37.7 640.3 33.3 686 32C731.7 30.7 777.3 32.3 823 32.2C868.7 32 914.3 30 937.2 29L960 28L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#edb279"></path><path d="M0 17L22.8 16.5C45.7 16 91.3 15 137 15.5C182.7 16 228.3 18 274 19.3C319.7 20.7 365.3 21.3 411.2 20.8C457 20.3 503 18.7 548.8 18.8C594.7 19 640.3 21 686 21.5C731.7 22 777.3 21 823 20C868.7 19 914.3 18 937.2 17.5L960 17L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#f2cc8f"></path></svg>
            </div>
            
            <ErrorAlert error={tableError} />
            <form className="px-2" onSubmit={handleSubmit} aria-label="table form">
                <div className="form-group">
                    <label htmlFor="table_name" className="text-uppercase font-weight-bold">Table Name:</label>
                    <input name="table_name" id="table_name" type="text" className="form-control" onChange={handleChange} value={table.table_name} minLength="2" required />
                </div>
                <div className="form-group">
                    <label htmlFor="capacity" className="text-uppercase font-weight-bold">Capacity:</label>
                    <input name="capacity" id="capacity" type="text" placeholder="1" className="form-control" onChange={handleChange} value={table.capacity} required  />
                </div>
                <div className="form-group">
                    <button className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
        </main>
    );
}