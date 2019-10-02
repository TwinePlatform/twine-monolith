import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Paragraph, Link } from '../text/base';
import { FlexContainerCol, FlexContainerRow } from '../layout/base';
import { PrimaryButton } from '../form/base';
import PrintableQrCode from './PrintableQrCode';

const ButtonsFlexContainerCol = styled(FlexContainerCol)`
  padding-top: 10%;
  width: 40%;
`;

const SubmitButton = styled(PrimaryButton)`
  height: 4em;
  width: 90%;
  margin-bottom: 5%;
`;

const CenteredParagraph = styled(Paragraph)`
  width: 90%;
  font-weight: medium;
  font-size: 21px;
  text-align: center;
  margin-top: 5%;
  padding-left: 15%;
`;

const CenteredHeading = styled(Heading)`
  padding-top: 5%;
  padding-left: 10%;
  width: 90%;
  text-align: center;
  font-weight: heavy;
`;

const QRimg = styled.img`
  height: 25em;
  width: 100%;
  object-fit: contain;
  object-position: left;
  display: block;
  margin-top: 10%;
`;

const NotPrint = styled(FlexContainerCol)`
  @media print {
    display: none;
  }
`;

const QRContainer = styled.div`
  height: 50%;
  width: 50%;
  display: block;
`;

const DisplayQrCode = props => (
  <React.Fragment>
    <PrintableQrCode cbLogoUrl={props.cbLogoUrl} qrCode={props.qrCode} />
    <NotPrint>
      <FlexContainerCol>
        <CenteredHeading>Here is your QR code</CenteredHeading>
        <CenteredParagraph>
          {
            props.forAdmin
              ? 'Please print this page'
              : 'Please print this page and use the code to sign in when you visit us. We have also emailed you a copy.'
          }
        </CenteredParagraph>
        <CenteredParagraph>
          {
            props.forAdmin
              ? 'If you lose this QR code it can be re-printed from the Visitor page'
              : 'If you lose this QR code ask a staff member to re-print it for you'
          }
        </CenteredParagraph>
        <FlexContainerRow>
          <QRContainer>
            <QRimg src={props.qrCode} alt="This is your QR code" />
          </QRContainer>
          <ButtonsFlexContainerCol>
            {
              props.nextURL && <Link to={props.nextURL}><SubmitButton>NEXT</SubmitButton></Link>
            }
            <SubmitButton onClick={props.onClickPrint}>PRINT QR CODE</SubmitButton>
          </ButtonsFlexContainerCol>
        </FlexContainerRow>
      </FlexContainerCol>
    </NotPrint>
  </React.Fragment>
);

DisplayQrCode.propTypes = {
  forAdmin: PropTypes.bool,
  cbLogoUrl: PropTypes.string.isRequired,
  qrCode: PropTypes.string.isRequired,
  nextURL: PropTypes.string,
  onClickPrint: PropTypes.func.isRequired,
};

DisplayQrCode.defaultProps = {
  forAdmin: false,
  nextURL: '',
};

export default DisplayQrCode;
