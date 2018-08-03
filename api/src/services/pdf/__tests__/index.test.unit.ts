import * as path from 'path';
import { getConfig } from '../../../../config';
import { PdfTemplateEnum, fromTemplate } from '..';


describe('PDF Service', () => {
  const { root } = getConfig(process.env.NODE_ENV);

  describe('fromTemplate', () => {
    test('Render visitor QR code template', async () => {
      const qrCodeDataUrl = path.resolve(root, 'assets', 'png', 'power_to_change_logo_small.png');
      const pdfDocument = await fromTemplate(PdfTemplateEnum.VISITOR_QR_CODE, { qrCodeDataUrl });
      expect(pdfDocument.length).toBeGreaterThan(100);
      expect(typeof pdfDocument).toBe('string');
    });

    test('Fail to render the visitor QR code template', async () => {
      expect.assertions(2);

      try {
        await fromTemplate(PdfTemplateEnum.VISITOR_QR_CODE, { foo: 'nonsense' });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error).toEqual(expect.stringContaining('Unrecognized document structure'));
      }
    });
  });
});
