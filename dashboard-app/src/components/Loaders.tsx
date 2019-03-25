import React from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';


const FullScreenLoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export const FullScreenBeatLoader = ({ ...rest }) => (
  <FullScreenLoaderContainer>
    <BeatLoader {...rest} size={30}/>
  </FullScreenLoaderContainer>
);
