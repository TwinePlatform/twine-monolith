import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import Heading from '../Headings';


export type HeaderContent = string | React.ReactElement;

interface NavHeaderItemProps {
  to?: string;
  content?: HeaderContent;
  onClick?: (a: any) => void;
}

const NavHeaderItem: React.SFC<NavHeaderItemProps> = ({ to, content, onClick }) => (
  to
    ? <Link to={to} onClick={onClick}>{content}</Link>
    : typeof content === 'string'
      ? <Heading onClick={onClick}>{content}</Heading>
      : <Fragment>{content}</Fragment>
);

NavHeaderItem.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  to: PropTypes.string,
  onClick: PropTypes.func,
};

NavHeaderItem.defaultProps = {
  content: undefined,
  to: undefined,
  onClick: () => {},
};

export default NavHeaderItem;
