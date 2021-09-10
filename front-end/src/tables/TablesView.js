import React, { useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { clearTable, updateStatus } from '../utils/api';
import { useHistory } from 'react-router-dom';

export default function TablesView({ tables, loadDashboard }) {
  const [finishError, setFinishError] = useState(null);

  const history = useHistory();

  async function handleFinish(tableId, reservation_id) {
    if (
      window.confirm(
        'Is this table ready to seat new guests? This cannot be undone.'
      )
    ) {
      const abortController = new AbortController();
      setFinishError(null);

      await clearTable(tableId);
      await updateStatus(reservation_id, { status: 'Finished' })
        .then(loadDashboard())
        .then(history.push('/'))
        .catch(setFinishError);
      return () => abortController.abort();
    }
  }

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
            onClick={() => handleFinish(table.table_id, table.reservation_id)}
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
