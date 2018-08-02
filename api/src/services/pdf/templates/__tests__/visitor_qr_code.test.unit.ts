import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import visitorQrCodeTemplate from '../visitor_qr_code';


describe('Visitor QR Code Template', () => {
  describe('createTemplate', () => {
    test('Create template w/ default logo', async () => {
      const qrCodeDataUrl = 'data:image/png;base64,fooqfoi2oitn';

      const result = await visitorQrCodeTemplate.createTemplate({ qrCodeDataUrl });
      const [logoColumn, qrCodeColumn] = result.content[0].columns;

      expect(logoColumn.image.startsWith('/')).toBeTruthy();
      expect(qrCodeColumn.image).toBe(qrCodeDataUrl);
    });

    test('Create template w/ custom logo as data URL', async () => {
      const qrCodeDataUrl = 'data:image/png;base64,fooqfoi2oitn';
      const logoUrl = 'data:image/png;base64,fowgno09tjfe0eiw';

      const result = await visitorQrCodeTemplate.createTemplate({ qrCodeDataUrl, logoUrl });
      const [logoColumn, qrCodeColumn] = result.content[0].columns;

      expect(logoColumn.image).toBe(logoUrl);
      expect(qrCodeColumn.image).toBe(qrCodeDataUrl);
    });

    test('Create template w/ custom logo as data URL', async () => {
      const imageContents = '20t48hwfbekjaofhw08rq3hiofnw';
      const url = 'https://example.com/images/fake.png';
      const qrCodeDataUrl = 'data:image/png;base64,fooqfoi2oitn';

      const mock = new MockAdapter(axios);
      mock.onGet(url).reply(200, imageContents);

      const result = await visitorQrCodeTemplate.createTemplate({ qrCodeDataUrl, logoUrl: url });
      const [logoColumn, qrCodeColumn] = result.content[0].columns;

      const processedImage = Buffer.from(imageContents).toString('base64');
      expect(logoColumn.image).toBe(`data:image/png;base64,${processedImage}`);
      expect(qrCodeColumn.image).toBe(qrCodeDataUrl);
    });
  });
});
