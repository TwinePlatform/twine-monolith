import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import p2cLogo from '../../../shared/assets/images/qrcodelogo.png';
import { Paragraph } from '../text/base';
import { FlexContainerRow } from '../layout/base';

const PrintContainer = styled.div`
  display: none;

  @media print {
    display: block;
    margin-top: 25pt;
    background: white;
    font-size: 12pt;
    text-align: center;
  }
`;

const CbLogo = styled.img`
  height: 50pt;
  flex: 1;
  flex-grow: 0;
`;

const QrCodePrint = styled.img``;

const PrintHeaderRow = styled(FlexContainerRow)`
  justify-content: center;
  align-items: center;
`;

const PrintableQrCode = ({ cbLogoUrl, qrCode }) => (
  <PrintContainer>
    <PrintHeaderRow>
      <CbLogo
        src={cbLogoUrl || p2cLogo}
        alt={cbLogoUrl ? 'Community Business logo' : 'Power to Change logo'}
      />
    </PrintHeaderRow>
    <QrCodePrint src={qrCode} alt="QR code" />
    <Paragraph>Please bring this QR code with you next time</Paragraph>
  </PrintContainer>
);


PrintableQrCode.propTypes = {
  cbLogoUrl: PropTypes.string.isRequired,
  qrCode: PropTypes.string.isRequired,
};


export default PrintableQrCode;
