import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { updateTable, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function SeatTable() {
  const [tables, setTables] = useState([]);
  const [tableError, setTableError] = useState(null);
  const [selectValue, setSelectValue] = useState('');

  const history = useHistory();
  const params = useParams();
  const id = Number(params.reservationId);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTableError(null);
    listTables(abortController.signal).then(setTables).catch(setTableError);
    return () => abortController.abort();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    updateTable(id, Number(selectValue.table_id))
      .then(() => history.push('/dashboard'))
      .catch(setTableError);
  };

  function changeHandler({ target: { name, value } }) {
    setSelectValue((previousSelectValue) => ({
      ...previousSelectValue,
      [name]: value,
    }));
  }

  const options = tables.map((table, id) => (
    <option value={table.table_id} key={id}>
      {`${table.table_name} - ${table.capacity}`}
    </option>
  ));

  return (
    <div className="main">
      <ErrorAlert error={tableError} />
      <div>
        <h5>Table Name - Table Capacity</h5>
      </div>
      <div className="select-container">
        <form onSubmit={handleSubmit}>
          <label>
            Select a table to seat this reservation:
            <select name="table_id" required onChange={changeHandler}>
              <option value=""></option>
              {options}
            </select>
          </label>
          <br />
          <button type="submit" className="btn btn-primary btn-sm">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={history.goBack}
          >
            Cancel
          </button>
        </form>
      </div>
      <div></div>
    </div>
  );
}
