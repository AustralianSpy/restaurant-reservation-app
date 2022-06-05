import React from "react";

export default function TableDetails({ tables }) {
    
    return tables.map((table) => {
        const { table_name, capacity, reservation_id, table_id } = table;
        const status = (reservation_id === null) ? "Free" : "Occupied";

        return (
            <div className="card mb-3" key={table_id}>
                <div className="card-header">
                    {table_name}
                </div>
                <div className="list-group list-group-flush">
                    <li className="list-group-item">Capacity: {capacity}</li>
                    <li className="list-group-item text-uppercase" data-table-id-status={table_id}>{status}</li>
                </div>
            </div>
        )
    })
}