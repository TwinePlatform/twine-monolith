import * as path from 'path';
import { getConfig } from '../../../../config';
import { PdfTemplateEnum, fromTemplate } from '..';


describe('PDF Service', () => {
  const { root } = getConfig(process.env.NODE_ENV);

  describe('fromTemplate', () => {
    test('Visitor QR Code Template', async () => {
      const qrCodeDataUrl = path.resolve(root, 'assets', 'png', 'power_to_change_logo_small.png');
      const pdfDocument = await fromTemplate(PdfTemplateEnum.VISITOR_QR_CODE, { qrCodeDataUrl });
      expect(pdfDocument.length).toBeGreaterThan(100);
      expect(typeof pdfDocument).toBe('string');
    });
  });
});
