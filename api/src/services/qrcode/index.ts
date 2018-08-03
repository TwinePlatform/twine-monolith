/*
 * QRCode service to generate qr codes
 */
const QRCode = require('qrcode');


export const create = async (payload: string): Promise<string> =>
  QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    color: { dark: '#06112f', light: '#FFFFFF' },
  });
