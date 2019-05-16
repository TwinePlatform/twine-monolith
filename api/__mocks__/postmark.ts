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

export const mockSendEmailWithTemplate =
  jest.fn((msg, cb) => Promise.resolve(__mockResponse));
export const mockSendEmailBatchWithTemplate =
  jest.fn((msgs, cb) => Promise.resolve(msgs.map((msg: any) => __mockResponse)));

export const ServerClient = jest.fn().mockImplementation(() => {
  return {
    sendEmailWithTemplate: mockSendEmailWithTemplate,
    sendEmailBatchWithTemplates: mockSendEmailBatchWithTemplate,
  };
});
