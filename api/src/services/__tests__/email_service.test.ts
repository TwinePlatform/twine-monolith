import { emailInitialiser } from '../email_service';
import { EmailTemplate } from '../templates';
import { getConfig } from '../../../config';

const config = getConfig(process.env.NODE_ENV);

const emailOptions = {
  to: 'hi@hello.com',
  from: 'bye@seeya.com',
  templateId: EmailTemplate.WELCOME_CB,
  templateModel: {},
};

describe('Email Service', () => {
  const emailService = emailInitialiser.init({ apiKey: config.email.postmark_key });
  describe('::send', () => {
    test('Correct email options throws error due to non existent template', async() => {
      try {
        await emailService.send(emailOptions);
      } catch (error) {
        expect(error.code).toBe(1101);
      }
    });
  });

  describe('::sendBatch', () => {
    test('Correct email options throws error due to non existent template', async() => {
      try {
        await emailService.sendBatch([emailOptions, emailOptions]);
      } catch (error) {
        expect(error.map((x: any) => x.code)).toBe(expect.arrayContaining([1101, 1101]));
      }
    });
  });
});
