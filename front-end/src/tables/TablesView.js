import React, { useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { clearTable } from '../utils/api';
import './TablesView.css';

export default function TablesView({ tables, loadDashboard }) {
  const [finishError, setFinishError] = useState(null);

  async function handleFinish(tableId) {
    if (
      window.confirm(
        'Is this table ready to seat new guests? This cannot be undone.'
      )
    ) {
      const abortController = new AbortController();
      setFinishError(null);
      try {
        await clearTable(tableId);
        loadDashboard();
      } catch (err) {
        setFinishError(err);
      }

      return () => abortController.abort();
    }
  }

  const content = tables.map((table, i) => (
    <div className="table" key={table.table_id}>
      <div className="card-header">{table.table_name}</div>
      <ul className="list-group">
        <li className="list-group-item">Capacity: {table.capacity}</li>
        <li
          className="list-group-item"
          data-table-id-status={`${table.table_id}`}
        >
          Status: {table.reservation_id ? 'Occupied' : 'Free'}
        </li>
        <div className="list-group-item card-footer ">
          {(table.reservation_id && (
            <button
              type="button"
              className=" btn finish-button"
              data-table-id-finish={`${table.table_id}`}
              onClick={() => handleFinish(table.table_id, table.reservation_id)}
            >
              Finish
            </button>
          )) || <p className="no-buttons"></p>}
        </div>
      </ul>
    </div>
  ));

  return (
    <>
      {finishError && (
        <div>
          <ErrorAlert error={finishError} />
        </div>
      )}
      {tables.length !== 0 && (
        <>
          <div className="tables-header">
            <h3>Tables</h3>
          </div>
          <div className="tables-list">{content}</div>
        </>
      )}
    </>
  );
}
