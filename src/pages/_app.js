/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.element.isRequired,
  pageProps: PropTypes.shape().isRequired,
};
