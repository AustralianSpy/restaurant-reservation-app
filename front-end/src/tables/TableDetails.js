import React, { useState } from "react";
import { useHistory } from "react-router";
import { finishTable } from "../utils/api";

export default function TableDetails({ tables }) {
    const history = useHistory();
    const [tableId, setTableId] = useState(null);

    const handleFinish = (event) => {
        event.preventDefault();
        
        const abortController = new AbortController();
        const submitData = async () => {
            try {
                await finishTable(tableId, abortController.signal);
                history.push('/dashboard');
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

    const handleSetId = (table_id) => {
        setTableId(table_id);
    }

    return (
        <section>
            {
                tables.map((table) => {
                    const { table_name, capacity, reservation_id, table_id } = table;
                    const occupied = (reservation_id === null) ?  false : true;
        
                    return (
                        <div className="card mb-3" key={table_id}>
                            <div className="card-header">
                                {table_name}
                            </div>
                            <div className="list-group list-group-flush">
                                <li className="list-group-item">Capacity: {capacity}</li>
                                <li className="list-group-item text-uppercase" data-table-id-status={table_id}>
                                    {
                                        !occupied ?
                                            "Free" :
                                            <>Occupied
                                            <button type="button"
                                            className="btn btn-dark ml-3"
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
                            <button className="btn btn-primary" onClick={handleFinish}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}