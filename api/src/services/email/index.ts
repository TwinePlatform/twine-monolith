import EmailDispatcher from './dispatcher';
import { EmailTemplate, Templates } from './templates';
import { Config } from '../../../config';
import { User, CommunityBusiness } from '../../models';
import { RoleEnum } from '../../models/types';
import { AppEnum } from '../../types/internal';


export type EmailService = {
  newVisitor:
    (c: Config, v: User, a: User, cb: CommunityBusiness, at: string) => Promise<void>

  visitorReminder:
    (c: Config, v: User, cb: CommunityBusiness, at: string) => Promise<void>

  newVolunteer:
    (c: Config, v: User, a: User, cb: CommunityBusiness) => Promise<void>

  newCbAdmin:
    (c: Config, a: User, cb: CommunityBusiness, t: string) => Promise<void>

  addRole:
    (c: Config, a: User, cb: CommunityBusiness, r: RoleEnum, t: string) => Promise<void>

  resetPassword:
    (c: Config, ap: AppEnum, a: User, t: string) => Promise<void>
};


const Service: EmailService = {
  async newVisitor (cfg, visitor, admin, cb, attachment) {
    await EmailDispatcher.sendBatch(cfg, [
      {
        from: cfg.email.fromAddress,
        to: visitor.email,
        templateId: EmailTemplate.WELCOME_VISITOR,
        templateModel: {
          domain: cfg.platform.domains[AppEnum.VISITOR],
          name: visitor.name,
          organisation: cb.name,
        },
        attachments: [{
          name: `${visitor.name}-QrCode.pdf`,
          content: attachment,
          contentType: 'application/octet-stream',
        }],
      },
      {
        from: cfg.email.fromAddress,
        to: admin.email,
        templateId: EmailTemplate.NEW_VISITOR_CB_ADMIN,
        templateModel: {
          domain: cfg.platform.domains[AppEnum.VISITOR],
          name: visitor.name,
          email: visitor.email,
        },
        attachments: [{
          name: `${visitor.name}-QrCode.pdf`,
          content: attachment,
          contentType: 'application/octet-stream',
        }],
      },
    ]);
  },

  async visitorReminder (cfg, visitor, cb, attachment) {
    console.log('INSIIIIIIIIIIIIDE');

    await EmailDispatcher.send(cfg, {
      from: cfg.email.fromAddress,
      to: visitor.email,
      templateId: EmailTemplate.WELCOME_VISITOR,
      templateModel: {
        domain: cfg.platform.domains[AppEnum.VISITOR],
        name: visitor.name,
        organisation: cb.name,
      },
      attachments: [{
        name: `${visitor.name}-QrCode.pdf`,
        content: attachment,
        contentType: 'application/octet-stream',
      }],
    });

    console.log('DOOOOOOONNNNNNNNNEEEEEE');
  },

  async newVolunteer (cfg, volunteer, admin, cb) {
    return null;
  },

  async newCbAdmin (cfg, admin, cb, token) {
    await EmailDispatcher.send(cfg, {
      from: cfg.email.fromAddress,
      to: admin.email,
      templateId: EmailTemplate.WELCOME_CB_ADMIN,
      templateModel: {
        domain: cfg.platform.domains[AppEnum.VISITOR], // TODO: Maybe change to different app?
        name: admin.name,
        email: admin.email,
        organisation: cb.name,
        token,
      },
    });
  },

  async addRole (cfg, user, cb, role, token) {
    await EmailDispatcher.send(cfg, {
      from: cfg.email.fromAddress,
      to: user.email,
      templateId: EmailTemplate.NEW_ROLE_CONFIRM,
      templateModel: {
        domain: cfg.platform.domains[AppEnum.VISITOR], // TODO: Currently redirects to visitor app
        email: user.email,
        token,
        organisationName: cb.name,
        role: role.toLowerCase(),
        userId: user.id,
        organisationId: cb.id,
      },
    });
  },

  async resetPassword (cfg, app, user, token) {
    const templateId = Templates.forPwdReset(app);
    await EmailDispatcher.send(cfg, {
      from: cfg.email.fromAddress,
      to: user.email,
      templateId,
      templateModel: {
        domain: cfg.platform.domains[app],
        email: user.email,
        token,
      },
    });
  },
};

export default Service;
