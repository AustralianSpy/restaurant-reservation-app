import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
// import { createTable } from "../utils/api";

export default function TablesForm() {
    const history = useHistory();
    const { path } = useRouteMatch();
    // Use path to determine what heading / form content to render.

    const initialFormState = {
        table_name: "",
        capacity: "",
    };
    const [table, setTable] = useState({ ...initialFormState });
    const [tableError, setTableError] = useState(null);
    

    const handleChange = ({ target }) => {
        let { value } = target;
        if (target.name === "capacity") value = Number(target.value);
        
        setTable({
            ...table,
            [target.name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setTableError(null);
        const abortController = new AbortController();
        const submitData = async () => {
            if (path === "/tables/new"){
                try {
                    // await createTable(table, abortController.signal);
                    // history.push('/dashboard')
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

    return (
        <main>
            <h1>{(path === "/tables/new") ? "Add a new table:" : "Edit an existing table:"}</h1>
            <ErrorAlert error={tableError} />
            <form onSubmit={handleSubmit} aria-label="table form">
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