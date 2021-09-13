import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function NewTable() {
  const [tableError, setTableError] = useState(null);
  const [table, setTable] = useState({
    table_name: '',
    capacity: '',
  });

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    createTable(table)
      .then(() => history.push(`/dashboard`))
      .catch(setTableError);
  };

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'capacity') {
      value = Number(value);
    }
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  };

  return (
    <form className="table-form mt-3" onSubmit={handleSubmit}>
      <ErrorAlert error={tableError} />
      <label className="table-name">
        Table Name:
        <input
          name="table_name"
          type="text"
          placeholder="Bar 1"
          minLength="2"
          required
          value={table.table_name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Capacity:
        <input
          name="capacity"
          type="number"
          placeholder="min of 1"
          min="1"
          required
          value={table.capacity}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit" className="btn btn-sm btn-primary">
        Submit
      </button>
      <button className="btn btn-sm btn-danger" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
