import * as Postmark from 'postmark';
import Dispatcher from '../dispatcher';
import { getConfig } from '../../../../config';


jest.mock('postmark');


describe('Email Dispatcher', () => {
  const config = getConfig(process.env.NODE_ENV);

  afterAll(() => jest.unmock('postmark'));

  beforeEach(() => {
    (<any> Postmark.ServerClient).mockClear();
  });

  describe('send', () => {
    test('sends email via postmark without model', async () => {
      const response = await Dispatcher.send(config, {
        to: 'foo@bar.com',
        from: 'twine@lol.com',
        templateId: 100,
      });

      expect(response).toEqual((<any> Postmark).__mockResponse);
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenCalledWith({
        To: 'foo@bar.com',
        From: 'twine@lol.com',
        TemplateId: 100,
        Attachments: [],
      });
    });

    test('sends email via postmark with model', async () => {
      const model = { foo: 'bar', baz: 'bax' };
      const response = await Dispatcher.send(config, {
        to: 'foo@bar.com',
        from: 'twine@lol.com',
        templateId: 100,
        templateModel: model,
      });

      expect(response).toEqual((<any> Postmark).__mockResponse);
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenCalledWith({
        To: 'foo@bar.com',
        From: 'twine@lol.com',
        TemplateId: 100,
        TemplateModel: model,
        Attachments: [],
      });
    });

    test('sends email via postmark with attachments', async () => {
      const response = await Dispatcher.send(config, {
        to: 'foo@bar.com',
        from: 'twine@lol.com',
        templateId: 100,
        attachments: [
          { name: 'a1', content: 'boo', contentType: 'application/json' },
          { name: 'a2', content: 'foo', contentType: 'octet-stream' },
        ],
      });

      expect(response).toEqual((<any> Postmark).__mockResponse);
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenCalledWith({
        To: 'foo@bar.com',
        From: 'twine@lol.com',
        TemplateId: 100,
        Attachments: [
          { Name: 'a1', ContentID: null, Content: 'boo', ContentType: 'application/json' },
          { Name: 'a2', ContentID: null, Content: 'foo', ContentType: 'octet-stream' },
        ],
      });
    });
  });

  describe('sendBatch', () => {
    test('sends multiple emails via postmark without models', async () => {
      const emails = [
        {
          to: 'foo@bar.com',
          from: 'twine@lol.com',
          templateId: 100,
        },
        {
          to: 'x@y.com',
          from: 'a@b.com',
          templateId: 2032,
        },
      ];
      const response = await Dispatcher.sendBatch(config, emails);

      expect(response).toEqual(expect.arrayContaining([(<any> Postmark).__mockResponse]));
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailBatchWithTemplate).toHaveBeenCalledWith([
        {
          To: 'foo@bar.com',
          From: 'twine@lol.com',
          TemplateId: 100,
          Attachments: [],
        },
        {
          To: 'x@y.com',
          From: 'a@b.com',
          TemplateId: 2032,
          Attachments: [],
        },
      ]);
    });

    test('sends multiple emails via postmark with some models', async () => {
      const emails = [
        {
          to: 'foo@bar.com',
          from: 'twine@lol.com',
          templateId: 100,
          templateModel: { foo: 1, bar: 'baz ' },
        },
        {
          to: 'x@y.com',
          from: 'a@b.com',
          templateId: 2032,
        },
      ];
      const response = await Dispatcher.sendBatch(config, emails);

      expect(response).toEqual(expect.arrayContaining([(<any> Postmark).__mockResponse]));
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailBatchWithTemplate).toHaveBeenCalledWith([
        {
          To: 'foo@bar.com',
          From: 'twine@lol.com',
          TemplateId: 100,
          TemplateModel: { foo: 1, bar: 'baz ' },
          Attachments: [],
        },
        {
          To: 'x@y.com',
          From: 'a@b.com',
          TemplateId: 2032,
          Attachments: [],
        },
      ]);
    });

    test('sends multiple emails via postmark with attachments', async () => {
      const emails = [
        {
          to: 'foo@bar.com',
          from: 'twine@lol.com',
          templateId: 100,
          templateModel: { foo: 1, bar: 'baz ' },
        },
        {
          to: 'x@y.com',
          from: 'a@b.com',
          templateId: 2032,
          attachments: [
            { name: 'a1', content: 'boo', contentType: 'application/json' },
            { name: 'a2', content: 'foo', contentType: 'octet-stream' },
          ],
        },
      ];
      const response = await Dispatcher.sendBatch(config, emails);

      expect(response).toEqual(expect.arrayContaining([(<any> Postmark).__mockResponse]));
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailBatchWithTemplate).toHaveBeenCalledWith([
        {
          To: 'foo@bar.com',
          From: 'twine@lol.com',
          TemplateId: 100,
          TemplateModel: { foo: 1, bar: 'baz ' },
          Attachments: [],
        },
        {
          To: 'x@y.com',
          From: 'a@b.com',
          TemplateId: 2032,
          Attachments: [
            { Name: 'a1', ContentID: null, Content: 'boo', ContentType: 'application/json' },
            { Name: 'a2', ContentID: null, Content: 'foo', ContentType: 'octet-stream' },
          ],
        },
      ]);
    });
  });
});
