import * as Postmark from 'postmark';
import { EmailTemplate } from './templates';
import { Config } from '../../../config';


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

export type EmailDispatcher = {
  send: (c: Config, e: Email) => Promise<Postmark.Models.MessageSendingResponse>
  sendBatch: (c: Config, es: Email []) => Promise<Postmark.Models.MessageSendingResponse[]>
};


const toPostmarkMsg = (a: Email): Postmark.TemplatedMessage => ({
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

const EmailDispatcher: EmailDispatcher = {
  async send (cfg, email) {
    const client = new Postmark.ServerClient(cfg.email.postmarkKey);
    return client.sendEmailWithTemplate(toPostmarkMsg(email));
  },
  async sendBatch (cfg, emails) {
    const client = new Postmark.ServerClient(cfg.email.postmarkKey);
    return client.sendEmailBatchWithTemplates(emails.map(toPostmarkMsg));
  },
};

export default EmailDispatcher;
