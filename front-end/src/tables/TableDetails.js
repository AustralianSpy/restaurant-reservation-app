import React, { useState } from "react";
import { useHistory } from "react-router";
import { finishTable } from "../utils/api";

import "./TableDetails.css";

/*
    Component lists all registered tables as well as handles the 
    'finish table' functionality that removes a seated reservation
    from that table.
*/

export default function TableDetails({ tables }) {
    const [tableId, setTableId] = useState(null);
    const history = useHistory();

    // --------> API CALL.
    const handleFinish = (event) => {
        event.preventDefault();
        
        const abortController = new AbortController();
        const submitData = async () => {
            try {
                await finishTable(tableId, abortController.signal);
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

    // --------> HOLD ID OF TABLE USER IS ATTEMPTING TO FINISH.
    const handleSetId = (table_id) => {
        setTableId(table_id);
    }

    if (tables.length === 0) {
        return (
            <h5 className="text-center w-100">You have no registered tables.</h5>
        )
    } else {
        return (
            <section className="px-3 d-flex flex-row justify-content-around flex-wrap tables-container">
                {
                    tables.map((table) => {
                        const { table_name, capacity, reservation_id, table_id } = table;
                        const occupied = (reservation_id === null) ?  false : true;
            
                        return (
                            <div className="card mb-3 table-card" key={table_id}>
                                <div className="card-header">
                                    {table_name}
                                </div>
                                <div className="list-group list-group-flush">
                                    <li className="list-group-item">Capacity: {capacity}</li>
                                    <li className="list-group-item text-uppercase status-row" data-table-id-status={table_id}>
                                        {
                                            !occupied ?
                                                "free" :
                                                <>occupied
                                                <button type="button"
                                                className="btn btn-finish ml-3"
                                                data-toggle="modal" data-target="#finishTable"
                                                aria-controls="finishTable"
                                                aria-hidden="true" aria-label="toggle modal"
                                                onClick={()=> handleSetId(table_id)}
                                                data-table-id-finish={table_id}>
                                                    Finish
                                                </button></>
                                        }
                                    </li>
                                </div>
                            </div>
                        )
                    })
                }
            
                { /* MODAL PROMPT. Defaults to hidden until above button is clicked. */ }
                <div className="modal fade" id="finishTable" tabIndex="-1" aria-labelledby="finishTableLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="finishTableLabel">Finishing Table...</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Is this table ready to seat new guests? This cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button className="btn btn-primary" data-method-name="accept" aria-label="accept" onClick={handleFinish}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
    
}