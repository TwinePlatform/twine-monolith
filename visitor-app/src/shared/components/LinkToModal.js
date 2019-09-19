import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _Modal from 'react-modal';
import { Paragraph, Link } from './text/base';


const Modal = styled(_Modal)`
  position: absolute;
  left: 0;
  right: 0;
  top: 40vh;
  width: 30vw;
  margin: 0 auto;
  border: 1px solid grey;
  border-radius: 4px;
  background: white;
  overflow: auto;
  padding: 2rem;
  outline: none;
`;

const Container = styled.div`
  margin-bottom: 1rem;
`;

Modal.setAppElement('#root');


export default class LinkToModal extends React.Component {
  state = {
    open: false,
  }

  open = () => {
    this.setState({ open: true });
  }

  close = () => {
    this.setState({ open: false });
  }

  render() {
    return (
      <Container>
        <Link to="#" onClick={this.open}>{this.props.linkText}</Link>
        <Modal
          isOpen={this.state.open}
          onRequestClose={this.close}
          contentLabel={this.props.contentLabel}
        >
          <Paragraph>{this.props.content}</Paragraph>
        </Modal>
      </Container>
    );
  }
}

LinkToModal.propTypes = {
  linkText: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  contentLabel: PropTypes.string,
};

LinkToModal.defaultProps = {
  contentLabel: 'Tooltip',
};
