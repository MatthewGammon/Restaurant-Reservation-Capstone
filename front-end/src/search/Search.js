import { React, useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { listReservations } from '../utils/api';
import ReservationsList from '../reservations/ReservationsList';

export default function Search() {
  const [number, setNumber] = useState({
    mobile_number: '',
  });

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    setSearched(false);
    try {
      const data = await listReservations(number, abortController.signal);
      setReservations(data);
      setSearched(true);
    } catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  }

  function handleChange({ target: { name, value } }) {
    setNumber((previousNumber) => ({
      ...previousNumber,
      [name]: value,
    }));
  }

  return (
    <div className="main">
      <div className="searchBox">
        <form className="searchForm mt-3" onSubmit={handleSubmit}>
          <label>
            <h4>Search</h4>
            <input
              style={{ width: '400px' }}
              name="mobile_number"
              type="text"
              placeholder="Enter a customer's phone number"
              required
              value={number.mobile_number}
              onChange={handleChange}
            />
            <button className="btn btn-primary ml-2" type="submit">
              Find
            </button>
          </label>
        </form>
      </div>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <div className="content">
        {reservations.length !== 0 && (
          <>
            <h5>Reservations matching number: {number.mobile_number}</h5>
            <ReservationsList reservations={reservations} />
          </>
        )}

        {searched && reservations.length === 0 ? (
          <h3>No reservations found</h3>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
