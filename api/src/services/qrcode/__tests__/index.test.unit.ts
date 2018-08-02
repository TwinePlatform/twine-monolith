import { createHmac } from 'crypto';
import * as QRCode from '..';
import { getConfig } from '../../../../config';


describe('QRCode Service', () => {
  const config = getConfig(process.env.NODE_ENV);

  describe('create', () => {
    test('Creates a signed HMAC and corresponding QR code data URL', async () => {
      const raw = 'foo';
      const { payload, dataUrl } = await QRCode.create(raw);

      expect(payload).toBe(createHmac('sha256', config.qrcode.secret).update(raw).digest('hex'));
      expect(typeof dataUrl).toBe('string');
    });
  });
});
