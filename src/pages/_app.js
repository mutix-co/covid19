/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="實聯制 | 免費電子解決方案" />
        <meta property="og:description" content="以明確告知、僅存28天、禁止目的外利用、配合疫調、安全維護及資安防護為原則" />
        <meta property="og:image" content="https://covid19.mutix.co/images/cover.png" />
        <link rel="stylesheet" href="/styles/normalize.css?v=20200801" />
        <link rel="stylesheet" href="/styles/global.css?v=20200801" />
      </Head>
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape().isRequired,
};
