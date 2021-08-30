import React, { useState, useEffect } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { listTables } from '../utils/api';

export default function TablesView() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const content = tables.map((table, i) => (
    <div key={i} className="d-flex">
      <div className="col-4">
        <p>{table.table_name}</p>
      </div>
      <div className="col-4">
        <p>{table.capacity}</p>
      </div>
      <div className="col-4">
        <p>{table.occupied ? 'Occupied' : 'Free'}</p>
      </div>
    </div>
  ));

  return (
    <main>
      <ErrorAlert error={tablesError} />
      <h4>Tables</h4>
      <div className="d-flex">
        <div className="col-4">
          <h5>Table Name</h5>
        </div>
        <div className="col-4">
          <h5>Capacity</h5>
        </div>
        <div className="col-4">
          <h5>Status</h5>
        </div>
      </div>
      <div>{tables && content}</div>
    </main>
  );
}
