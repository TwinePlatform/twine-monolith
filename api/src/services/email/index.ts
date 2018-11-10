import * as Postmark from 'postmark';
import { EmailTemplate } from './templates';

type Attachment = {
  name: string,
  content: string,
  contentType: string,
};

type Email = {
  from: string,
  to: string,
  templateId: EmailTemplate,
  templateModel?: object,
  attachments?: Attachment[],
};

type EmailServiceConfig = {
  apiKey: string,
};

export type EmailService = {
  send: (emailOptions: Email) => Promise <Postmark.Models.MessageSendingResponse>,
  sendBatch: (emailOptions: Email []) => Promise <Postmark.Models.MessageSendingResponse[]>,
};

type EmailInitialiser = {
  init: (config: EmailServiceConfig) => EmailService,
};

const emailKeyMap = (a: Email): Postmark.TemplatedMessage => ({
  To: a.to,
  From: a.from,
  TemplateId: a.templateId,
  TemplateModel: a.templateModel,
  Attachments: (a.attachments || []).map(toPostmarkAttachment),
});

const toPostmarkAttachment = (a: Attachment): Postmark.Attachment => ({
  Name: a.name,
  ContentID: null,
  Content: a.content,
  ContentType: a.contentType,
});

const emailInitialiser: EmailInitialiser = {
  init: (config: EmailServiceConfig) => {
    const emailClient = new Postmark.ServerClient(config.apiKey);

    return {
      send: async (emailOptions: Email) => {
        const postmarkOptions = emailKeyMap(emailOptions);

        return emailClient.sendEmailWithTemplate(postmarkOptions);
      },
      sendBatch: async (emails: Email []) => {
        const postmarkEmails = emails.map(emailKeyMap);

        return emailClient.sendEmailBatchWithTemplates(postmarkEmails);
      },
    };
  },
};

export { emailInitialiser };
