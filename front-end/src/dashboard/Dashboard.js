import React, { useEffect, useState } from 'react';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory } from 'react-router-dom';
import { previous, next } from '../utils/date-time';
import TablesView from '../tables/TablesView';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handlePreviousDate = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDate = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const handleTodayClick = () => {
    history.push('/');
  };

  const content = reservations.map((reservation, i) => (
    <div key={i} className="d-flex">
      <div className="col-2">
        <p>{reservation.first_name}</p>
      </div>
      <div className="col-2">
        <p>{reservation.last_name}</p>
      </div>
      <div className="col-2">
        <p>{reservation.mobile_number}</p>
      </div>
      <div className="col-2">
        <p>{reservation.reservation_time}</p>
      </div>
      <div className="col-1">
        <p>{reservation.people}</p>
      </div>
      <div>
        <p data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </p>
      </div>
      <div className="col-1">
        {' '}
        {reservation.status === 'booked' && (
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button" className="btn btn-primary btn-sm px-2">
              Seat
            </button>
          </a>
        )}
      </div>
    </div>
  ));

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <div className="mb-3">
        <button
          className="btn btn-secondary mr-2"
          onClick={() => handlePreviousDate(date)}
        >
          previous
        </button>
        <button
          className="btn btn-secondary mr-2"
          onClick={() => handleNextDate(date)}
        >
          next
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleTodayClick()}
        >
          today
        </button>
      </div>
      <div className="d-flex">
        <div className="col-2">
          <h5>First Name</h5>
        </div>
        <div className="col-2">
          <h5>Last Name</h5>
        </div>
        <div className="col-2">
          <h5>Mobile number</h5>
        </div>
        <div className="col-2">
          <h5>Reservation Time</h5>
        </div>
        <div className="col-1">
          <h5>Party Size</h5>
        </div>
        <div>
          <h5>Status</h5>
        </div>
      </div>
      <div>{content}</div>
      <div>
        <ErrorAlert error={tablesError} />
      </div>
      <div>
        <TablesView tables={tables} date={date} loadDashboard={loadDashboard} />
      </div>
    </main>
  );
}

export default Dashboard;
