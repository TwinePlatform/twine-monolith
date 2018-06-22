import * as Postmark from 'postmark';
import { renameKeys } from '../utils/ramdaHelpers';
import { pipe, curry, evolve } from 'ramda';

const templateJson = require('./templates.json');

type Email = {
  from: string,
  to: string,
  templateId: string,
  templateModel?: object,
  attachements?: [{
    name: string,
    content: string,
    contentType: string,
  }],
};

type RemoteTemplate = {
  description: string,
  remoteId: string,
};

type EmailConfig = {
  apiKey: string,
};

const getTemplateId = curry(
  (templateJson: {[k: number]: RemoteTemplate}, templateId: number) =>
    templateJson[templateId].remoteId,
)(templateJson);

const mapRemoteTemplateId = evolve({ templateId: getTemplateId });

const emailKeyMap = renameKeys({
  to: 'To',
  from: 'From',
  templateId: 'TemplateId',
  templateModel: 'TemplateModel',
  attachements: 'Attachments',
});

const emailService = {
  init: (config: EmailConfig) => {
    const emailClient = new Postmark.Client(config.apiKey, {});

    const emailInterface = {
      send: async (emailOptions: Email): Promise <Postmark.SendStatus> => {
        const postmarkOptions: Postmark.PostmarkMessageWithTemplate = pipe(
          mapRemoteTemplateId,
          emailKeyMap,
        )(emailOptions);

        return emailClient.sendEmailWithTemplate(postmarkOptions);
      },
      sendBatch: async(emails: Email []) => {
        const postmarkEmails: Postmark.PostmarkMessage[] = emails.map((x) =>
         pipe(
            mapRemoteTemplateId,
            emailKeyMap,
          )(x));

        return emailClient.sendEmailBatch(postmarkEmails);
      },
    };
    return emailInterface;
  },
};

export { emailService };
