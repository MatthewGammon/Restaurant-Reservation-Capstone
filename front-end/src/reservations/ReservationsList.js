import React from 'react';

export default function ReservationsList({ reservations }) {
  const content = reservations.map((reservation, index) => (
    <div key={index}>
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
        <div className="card-footer bg-transparent border-dark">
          {reservation.status === 'booked' && (
            <>
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <button type="button" className="btn btn-primary btn-sm mr-2">
                  Seat
                </button>
              </a>
              <a href={`/reservations/${reservation?.reservation_id}/edit`}>
                <button type="button" className="btn btn-primary btn-sm">
                  Edit
                </button>
              </a>
            </>
          )}
        </div>
      </ul>
    </div>
  ));

  return <div>{content}</div>;
}
