import * as Postmark from 'postmark';
import { Callback, MessageSendingResponse } from 'postmark/dist/client/models';


export class ServerClient extends Postmark.ServerClient {
  // tslint:disable-next-line:max-line-length
  sendEmailWithTemplate = jest.fn((msg: Postmark.TemplatedMessage, cb?: Callback<MessageSendingResponse>) => {
    return Promise.resolve({
      SubmittedAt:  new Date().toISOString(),
      MessageID: 'msgid',
      ErrorCode: 0,
      Message: 'msg',
    });
  });

  // tslint:disable-next-line:max-line-length
  sendEmailBatchWithTemplates = jest.fn((msgs: Postmark.TemplatedMessage[], cb?: Callback<MessageSendingResponse[]>) => {
    return Promise.resolve(msgs.map((msg) => ({
      SubmittedAt: new Date().toISOString(),
      MessageID: 'msgid',
      ErrorCode: 0,
      Message: 'msg',
    })));
  });
}
