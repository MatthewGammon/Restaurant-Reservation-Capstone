import { React, useState, useEffect, useRef } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { listReservations } from '../utils/api';
import ReservationsList from '../reservations/ReservationsList';
import './Search.css';

export default function Search() {
  const [number, setNumber] = useState({
    mobile_number: '',
  });

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
    <div className="search-reservations">
      <div className="header">
        <h1>Search For A Reservation</h1>
      </div>
      <form className="search-form mt-3" onSubmit={handleSubmit}>
        <label>
          <input
            style={{ width: '400px' }}
            name="mobile_number"
            type="text"
            placeholder="Enter a customer's phone number"
            required
            ref={inputRef}
            value={number.mobile_number}
            onChange={handleChange}
          />
        </label>
        <button className="btn" type="submit">
          Find
        </button>
      </form>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <div className="content">
        {reservations.length !== 0 && (
          <>
            <h5 className="number-confirm">
              Reservations matching number: {number.mobile_number}
            </h5>
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
