import { React, useState } from 'react';
import { updateStatus } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import './ReservationsList.css';

export default function ReservationsList({ reservations }) {
  const [cancelError, setCancelError] = useState(null);

  async function handleCancel(reservationId) {
    if (
      window.confirm(
        'Do you want to cancel this reservation? This cannot be undone.'
      )
    ) {
      const abortController = new AbortController();
      setCancelError(null);
      try {
        await updateStatus(reservationId);
        window.location.reload();
      } catch (error) {
        setCancelError(error);
      }
      return () => abortController.abort();
    }
  }

  const content = reservations.map((reservation, index) => (
    <div className="reservation" key={reservation.reservation_id}>
      <div className="card-header">
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
        <div className="list-group-item card-footer ">
          {(reservation.status === 'booked' && (
            <>
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <button type="button" className="btn">
                  Seat
                </button>
              </a>
              <a href={`/reservations/${reservation.reservation_id}/edit`}>
                <button type="button" className="btn">
                  Edit
                </button>
              </a>
              <button
                data-reservation-id-cancel={reservation.reservation_id}
                type="button"
                className="btn"
                onClick={() => handleCancel(reservation.reservation_id)}
              >
                Cancel
              </button>
            </>
          )) || <p className="hidden-text">HIDE ME</p>}
        </div>
      </ul>
    </div>
  ));

  return (
    <div>
      <div>
        <ErrorAlert error={cancelError} />
      </div>
      <div className="reservations-list">{content}</div>
    </div>
  );
}
