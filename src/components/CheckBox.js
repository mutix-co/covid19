import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.label`
  width: 100%;
  margin: 10px 0;
  display: flex;
  cursor: pointer;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1em;
  line-height: 1.4em;
  font-weight: 300;
`;

const Box = styled.input`
  background: transparent;
  border: 1px solid #767676;
  border-radius: 3px;
  margin-right: 10px;
  height: 1.4em;
  margin-top: 1px;
`;

export default function Checkbox({ title, onChange, checked }) {
  return (
    <Container>
      <Box type="checkbox" onChange={onChange} checked={checked} />
      {title && <Title>{title}</Title>}
    </Container>
  );
}

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
