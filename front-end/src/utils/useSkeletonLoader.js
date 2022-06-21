import React, { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// --------> GENERATE LOAD-SKELETONS TO DISPLAY WHILE FETCHING.
export function useTablesLoader() {
    const tablesLoader = useMemo(() => {
        const skeleton = [];
        for (let i = 0; i < 3; i++) {
            skeleton.push(
            <div className="card mb-3 table-card" key={`skeleton ${i}`} >
                <div className="card-header">
                <Skeleton />
                </div>
                <div className="list-group list-group-flush">
                <li className="list-group-item"><Skeleton /></li>
                <li className="list-group-item text-uppercase status-row"><Skeleton /></li>
                </div>
            </div>
            );
        }
        return (
            <section className="px-3 d-flex flex-row justify-content-between flex-wrap tables-container">
            { skeleton.map((element) => element ) }
            </section>
        );
    }, []);

    return tablesLoader;
}

export function useReservationsLoader() {
    const reservationsLoader = useMemo(() => {
        const skeleton = [];
        for (let i = 0; i < 3; i++) {
            skeleton.push(
            <div className="card mb-3 reservation-card" key={`skeleton ${i}`}>
                <div className="card-header"><Skeleton /></div>
                <div className="list-group list-group-flush d-flex flex-row">
                    <li className="list-group-item"><Skeleton /></li>
                    <li className="list-group-item"><Skeleton /></li>
                    <li className="list-group-item"><Skeleton /></li>
                </div>
                <div className="card-body d-flex flex-row justify-content-between py-2">
                    <p className="text-uppercase fw-bold align-self my-auto"><Skeleton /></p>
                    <div><Skeleton /></div>
                </div>
            </div>
            );
        }
        return (
            <div className="d-flex justify-content-around flex-wrap reservations-container px-2">
            { skeleton.map((element) => element) }
            </div>
        );
    }, []);

    return reservationsLoader;
}