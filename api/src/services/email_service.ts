/// <postmark-module path="./postmark" />

import * as Postmark from 'postmark';
import { renameKeys } from '../utils/ramdaHelpers';
import { pipe, curry, evolve } from 'ramda';
import { VisitorEmailTemplate } from './templates';

type Email = {
  from: string,
  to: string,
  templateId: VisitorEmailTemplate,
  templateModel?: object,
  attachements?: [{
    name: string,
    content: string,
    contentType: string,
  }],
};

type EmailConfig = {
  apiKey: string,
};

type EmailService = {
  send: (emailOptions: Email) => Promise <Postmark.SendStatus>,
  sendBatch: (emailOptions: Email []) => Promise <Postmark.SendStatus[]>,
};

type EmailInitialiser = {
  init: (config: EmailConfig) => EmailService,
};

const getTemplateId = (id: any):any => VisitorEmailTemplate[id];

const emailKeyMap: any = renameKeys({
  to: 'To',
  from: 'From',
  templateId: 'TemplateId',
  templateModel: 'TemplateModel',
  attachements: 'Attachments',
});

const emailService: EmailInitialiser = {
  init: (config: EmailConfig) => {
    const emailClient = new Postmark.Client(config.apiKey);
    const emailInterface = {
      send: async (emailOptions: Email) => {
        const postmarkOptions: Postmark.PostmarkMessageWithTemplate =
          emailKeyMap(emailOptions);

        return  emailClient.sendEmailWithTemplate(postmarkOptions);
      },
      sendBatch: async(emails: Email []) => {
        const postmarkEmails: Postmark.PostmarkMessage[] = emails.map(emailKeyMap);

        return emailClient.sendEmailBatch(postmarkEmails);
      },
    };
    return emailInterface;
  },
};

export { emailService };
