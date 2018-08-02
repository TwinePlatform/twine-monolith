/*
 * QRCode service to generate qr codes
 */
import { createHmac } from 'crypto';
import { getConfig } from '../../../config';
const QRCode = require('qrcode');

const { qrcode: { secret } } = getConfig(process.env.NODE_ENV);


export const create = async (raw: string): Promise<{ payload: string, dataUrl: string }> => {
  const payload =
    createHmac('sha256', secret)
      .update(raw)
      .digest('hex');

  const dataUrl =
    await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      color: { dark: '#06112f', light: '#FFFFFF' },
    });

  return { payload, dataUrl };
};
