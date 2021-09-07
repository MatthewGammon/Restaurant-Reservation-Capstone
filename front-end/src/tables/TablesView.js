import React, { useEffect, useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { clearTable, listTables } from '../utils/api';

export default function TablesView() {
  const [finishError, setFinishError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  const handleFinish = (tableId) => {
    if (
      window.confirm(
        'Is this table ready to seat new guests? This cannot be undone.'
      )
    ) {
      setFinishError(null);
      clearTable(tableId)
        .then(listTables)
        .then(setTables)
        .catch(setFinishError);
    }
  };

  const content = tables.map((table, i) => (
    <div key={i} className="d-flex">
      <div className="col-4">
        <p>{table.table_name}</p>
      </div>
      <div className="col-4">
        <p>{table.capacity}</p>
      </div>
      <div className="col-1">
        <h5 data-table-id-status={`${table.table_id}`}>
          {table.reservation_id ? 'Occupied' : 'Free'}
        </h5>
      </div>
      <div className="col-3">
        {' '}
        {table.reservation_id && (
          <button
            type="button"
            className="btn btn-warning btn-sm"
            data-table-id-finish={`${table.table_id}`}
            onClick={() => handleFinish(table.table_id)}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  ));

  return (
    <main>
      <ErrorAlert error={finishError} />
      <ErrorAlert error={tablesError} />
      <h4>Tables</h4>
      <div className="d-flex">
        <div className="col-4">
          <h5>Table Name</h5>
        </div>
        <div className="col-4">
          <h5>Capacity</h5>
        </div>
        <div className="col-1">
          <h5>Status</h5>
        </div>
      </div>
      <div>{tables && content}</div>
    </main>
  );
}
