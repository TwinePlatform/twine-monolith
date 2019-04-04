import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import NavHeaderItem, { HeaderContent } from './NavHeaderItem';


const noop = () => {};

const PaddedRow = styled(Row)`
  padding: 2em 0;
`;

interface NavHeaderProps {
  leftContent?: HeaderContent;
  centerContent?: HeaderContent;
  rightContent?: HeaderContent;
  leftTo?: string;
  centreTo?: string;
  rightTo?: string;
  leftOnClick?: (a: any) => void;
  centreOnClick?: (a: any) => void;
  rightOnClick?: (a: any) => void;
}

const NavHeader: React.SFC<NavHeaderProps> = (props) => (
  <PaddedRow middle="xs">
    <Col xs={3}>
      <NavHeaderItem
        to={props.leftTo}
        content={props.leftContent}
        onClick={props.leftOnClick}
      />
    </Col>
    <Col xs={6}>
      <NavHeaderItem
        to={props.centreTo}
        content={props.centerContent}
        onClick={props.centreOnClick}
      />
    </Col>
    <Col xs={3}>
      <NavHeaderItem
        to={props.rightTo}
        content={props.rightContent}
        onClick={props.rightOnClick}
      />
    </Col>
  </PaddedRow>
);


NavHeader.propTypes = {
  leftContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  centerContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  rightContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  leftTo: PropTypes.string,
  centreTo: PropTypes.string,
  rightTo: PropTypes.string,
  leftOnClick: PropTypes.func,
  centreOnClick: PropTypes.func,
  rightOnClick: PropTypes.func,
};

NavHeader.defaultProps = {
  leftContent: '',
  centerContent: '',
  rightContent: '',
  leftTo: '',
  centreTo: '',
  rightTo: '',
  leftOnClick: noop,
  centreOnClick: noop,
  rightOnClick: noop,
};


export default NavHeader;
