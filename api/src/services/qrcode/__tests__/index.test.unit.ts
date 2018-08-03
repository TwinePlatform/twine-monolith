import * as QRCode from '..';


describe('QRCode Service', () => {
  describe('create', () => {
    test('Creates a signed HMAC and corresponding QR code data URL', async () => {
      const raw = 'foo';
      const dataUrl = await QRCode.create(raw);
      expect(typeof dataUrl).toBe('string');
    });
  });
});
