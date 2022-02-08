import React, { useEffect, useState } from 'react';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory } from 'react-router-dom';
import { previous, next } from '../utils/date-time';
import ReservationsList from '../reservations/ReservationsList';
import TablesView from '../tables/TablesView';
import './Dashboard.css';

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

  return (
    <main className="main">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <h4>Reservations for date: {date}</h4>
        <div className="dashboard-buttons">
          <button className="btn mr-2" onClick={() => handlePreviousDate(date)}>
            previous
          </button>
          <button className="btn mr-2" onClick={() => handleNextDate(date)}>
            next
          </button>
          <button className="btn" onClick={() => handleTodayClick()}>
            today
          </button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationsList reservations={reservations} />
      <div>
        <ErrorAlert error={tablesError} />
      </div>
      <TablesView tables={tables} date={date} loadDashboard={loadDashboard} />
    </main>
  );
}

export default Dashboard;
