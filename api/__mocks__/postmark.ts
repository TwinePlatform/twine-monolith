export let __mockResponse = {
  SubmittedAt: new Date().toISOString(),
  MessageID: 'msgid',
  ErrorCode: 0,
  Message: 'msg',
};

// tslint:disable-next-line: max-line-length
export const __setMockResponse = (res: any) => {
  __mockResponse = { ...__mockResponse, ...res };
};

export const ServerClient = jest.fn().mockImplementation(() => {
  return {
    sendEmailWithTemplate: jest.fn((msg, cb) => {
      return Promise.resolve(__mockResponse);
    }),
    sendEmailBatchWithTemplates: jest.fn((msgs, cb) => {
      return Promise.resolve(msgs.map((msg: any) => (__mockResponse)));
    }),
  };
});
