import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Paragraph } from '../../../shared/components/text/base';


const Container = styled.div`
  position: relative;
`;

const HideableTextOverlay = styled.div`
  position: absolute;
  background-color: transparent;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s linear;
  display: block;
  height: 100%;
  width: 100%;
  padding: 20% 0;
  z-index: ${props => props.isVisible ? 1 : -1};

  @media (max-width: 1200px) {
    padding: 15% 0;
  };
`;

const TransitionText = styled(Paragraph)`
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.1s linear;
  transition-delay: 0.1s;
`;


const Overlay = ({ content, isVisible, children }) => (
  <Container>
    <HideableTextOverlay isVisible={isVisible}>
      <TransitionText isVisible={isVisible}>{content}</TransitionText >
    </HideableTextOverlay>
    {children}
  </Container>
);

Overlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Overlay;
