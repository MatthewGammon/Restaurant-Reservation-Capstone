import React from 'react';
import burger404 from '../assets/images/burger-404.jpg';

function NotFound() {
  return (
    <div className="notFound d-flex justify-content-center mt-5">
      <img src={burger404} alt="hamburger 404" />
    </div>
  );
}

export default NotFound;
