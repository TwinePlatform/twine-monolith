import * as Postmark from 'postmark';
import Dispatcher from '../dispatcher';
import { getConfig } from '../../../../config';


jest.mock('postmark');


describe('Email Dispatcher', () => {
  const config = getConfig(process.env.NODE_ENV);

  describe('send', () => {
    test('sends email via postmark without model', async () => {
      const response = await Dispatcher.send(config, {
        to: 'foo@bar.com',
        from: 'twine@lol.com',
        templateId: 100,
      });

      console.log(response, (<any> Postmark).mock.instances[0]);

      expect(response).toEqual((<any> Postmark).__mockResponse);
    });
  });
});
