import React from 'react';
import './Navbar.css';

export default function Navbar() {
  function displayMenu() {
    const element = document.getElementById('myTopnav');

    if (element.className === 'topnav') {
      element.className += ' responsive';
    } else {
      element.className = 'topnav';
    }
  }
  return (
    <nav className="nav">
      <div className="topnav" id="myTopnav">
        <a href="/" className="active">
          <span className="oi oi-dashboard" />
          &nbsp;Dashboard
        </a>
        <a href="/search">
          <span className="oi oi-magnifying-glass" />
          &nbsp;Search
        </a>
        <a href="/reservations/new">
          <span className="oi oi-plus" />
          &nbsp;New Reservation
        </a>
        <a href="/tables/new">
          <span className="oi oi-layers" />
          &nbsp;New Table
        </a>
        <div className="character-select"></div>
        <button className="icon" onClick={() => displayMenu()}>
          <i className="fa fa-bars"></i>
        </button>
      </div>
      <div className="nav-header">
        <h3>Periodic Tables</h3>
      </div>
    </nav>
  );
}
