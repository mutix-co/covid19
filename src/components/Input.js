import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: 5px 0;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1.2em;
  line-height: 1.8em;
  font-weight: 500;
`;

const InputBar = styled.input`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid #767676;
  border-radius: 3px;
  font-weight: 500;
  box-sizing: border-box;
`;

export default function Input({ title, onChange, value }) {
  return (
    <Container>
      {title && <Title>{title}</Title>}
      <InputBar onChange={onChange} value={value} />
    </Container>
  );
}

Input.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
