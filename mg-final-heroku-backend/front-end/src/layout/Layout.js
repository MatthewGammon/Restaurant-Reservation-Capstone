import React from 'react';
import Navbar from './Navbar';
import Routes from './Routes';

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <>
      {' '}
      <Navbar />
      <Routes />
    </>
  );
}

export default Layout;
