import styled from 'styled-components';

export default styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;

  & > *:not(:last-child) {
    border-style: dotted;
    width: 30%;
  }

  & > *:not(:first-child) {
    margin-left: 10px;
  }
`;
