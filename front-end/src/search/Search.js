import { React, useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { listReservations } from '../utils/api';

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

  const matchedReservations = reservations.map((reservation, index) => {
    return (
      <div key={index}>
        {
          // should be using a reservations list that was previously defined and used in the dashboard
          // keeping this as a placeholder for now
        }
        <div className="card-header bg-dark text-light">
          {reservation.first_name} {reservation.last_name}
        </div>
        <ul className="list-group">
          <li className="list-group-item">
            Mobile Number: {reservation.mobile_number}
          </li>
          <li className="list-group-item">
            Reservation Date: {reservation.reservation_date}
          </li>
          <li className="list-group-item">
            Reservation Time: {reservation.reservation_time}
          </li>
          <li className="list-group-item">People: {reservation.people}</li>
          <li
            className="list-group-item"
            data-reservation-id-status={reservation.reservation_id}
          >
            Status: {reservation.status}{' '}
          </li>
        </ul>
        <div className="separator">
          <br />
        </div>
      </div>
    );
  });

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
      <div className="matchedReservations">
        {reservations.length !== 0 && (
          <>
            <h5>Reservations matching number: {number.mobile_number}</h5>
            <div>{matchedReservations}</div>
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
