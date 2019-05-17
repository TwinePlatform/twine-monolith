import * as Postmark from 'postmark';
import Service from '..';
import { EmailTemplate } from '../templates';
import { getConfig } from '../../../../config';
import factory from '../../../../tests/utils/factory';
import { User, CommunityBusiness } from '../../../models';
import { AppEnum } from '../../../types/internal';
import { RoleEnum } from '../../../models/types';
import Roles from '../../../models/role';


jest.mock('postmark');


describe('Email Service', () => {
  const config = getConfig(process.env.NODE_ENV);

  afterAll(() => {
    jest.unmock('postmark');
  });

  beforeEach(() => {
    (<any> Postmark.ServerClient).mockClear();
    (<any> Postmark).mockSendEmailWithTemplate.mockClear();
    (<any> Postmark).mockSendEmailBatchWithTemplate.mockClear();
  });

  describe('newVisitor', () => {
    test('sends notification emails to visitor and admin', async () => {
      const visitor: User = await factory.build('visitor');
      const admin: User = await factory.build('cbAdmin');
      const cb: CommunityBusiness = await factory.build('communityBusiness');
      const attachment = 'fake';

      await Service.newVisitor(config, visitor, admin, cb, attachment);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailBatchWithTemplate).toHaveBeenLastCalledWith([
        expect.objectContaining({
          To: visitor.email,
          TemplateId: EmailTemplate.WELCOME_VISITOR,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            name: visitor.name,
            organisation: cb.name,
          },
          Attachments: [expect.objectContaining({ Content: attachment })],
        }),
        expect.objectContaining({
          To: admin.email,
          TemplateId: EmailTemplate.NEW_VISITOR_CB_ADMIN,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            name: visitor.name,
            email: visitor.email,
          },
          Attachments: [expect.objectContaining({ Content: attachment })],
        }),
      ]);
    });
  });

  describe('visitorReminder', () => {
    test('sends welcome email to visitor only', async () => {
      const visitor: User = await factory.build('visitor');
      const cb: CommunityBusiness = await factory.build('communityBusiness');
      const attachment = 'fake';

      await Service.visitorReminder(config, visitor, cb, attachment);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          To: visitor.email,
          TemplateId: EmailTemplate.WELCOME_VISITOR,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            name: visitor.name,
            organisation: cb.name,
          },
          Attachments: [expect.objectContaining({ Content: attachment })],
        })
      );
    });
  });

  describe('newVolunteer', () => {
    test('sends welcome email to visitor only', async () => {
      const visitor: User = await factory.build('visitor');
      const admin: User = await factory.build('cbAdmin');
      const cb: CommunityBusiness = await factory.build('communityBusiness');

      const result = await Service.newVolunteer(config, visitor, admin, cb);

      expect(result).toBe(null);
      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(0);
      expect((<any> Postmark).mockSendEmailWithTemplate).not.toHaveBeenCalled();
    });
  });

  describe('newCbAdmin', () => {
    test('sends welcome email to CB admin', async () => {
      const admin: User = await factory.build('cbAdmin');
      const cb: CommunityBusiness = await factory.build('communityBusiness');
      const token = 'fake';

      await Service.newCbAdmin(config, admin, cb, token);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          To: admin.email,
          TemplateId: EmailTemplate.WELCOME_CB_ADMIN,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            name: admin.name,
            email: admin.email,
            organisation: cb.name,
            token,
          },
          Attachments: [],
        })
      );
    });
  });

  describe('addRole', () => {
    test('sends confirmation email to user', async () => {
      const volunteer: User = await factory.build('volunteer');
      const cb: CommunityBusiness = await factory.build('communityBusiness');
      const token = 'fake';

      await Service.addRole(config, volunteer, cb, RoleEnum.CB_ADMIN, token);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          To: volunteer.email,
          TemplateId: EmailTemplate.NEW_ROLE_CONFIRM,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            email: volunteer.email,
            userId: volunteer.id,
            role: Roles.toDisplay(RoleEnum.CB_ADMIN),
            organisationName: cb.name,
            organisationId: cb.id,
            token,
          },
          Attachments: [],
        })
      );
    });
  });

  describe('resetPassword', () => {
    test('sends email with visitor template to VISITOR', async () => {
      const visitor: User = await factory.build('visitor');
      const token = 'fake';

      await Service.resetPassword(config, AppEnum.VISITOR, visitor, token);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          To: visitor.email,
          TemplateId: EmailTemplate.PWD_RESET_VISITOR_APP,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            email: visitor.email,
            token,
          },
          Attachments: [],
        })
      );
    });

    test('sends email with dashboard template to CB_ADMIN', async () => {
      const admin: User = await factory.build('cbAdmin');
      const token = 'fake';

      await Service.resetPassword(config, AppEnum.DASHBOARD, admin, token);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          To: admin.email,
          TemplateId: EmailTemplate.PWD_RESET_DASHBOARD_APP,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.DASHBOARD],
            email: admin.email,
            token,
          },
          Attachments: [],
        })
      );
    });

    test('sends email with admin template to TWINE_ADMIN', async () => {
      const admin: User = await factory.build('user');
      const token = 'fake';

      await Service.resetPassword(config, AppEnum.ADMIN, admin, token);

      expect((<any> Postmark.ServerClient).mock.instances).toHaveLength(1);
      expect((<any> Postmark).mockSendEmailWithTemplate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          To: admin.email,
          TemplateId: EmailTemplate.PWD_RESET_ADMIN_APP,
          TemplateModel: {
            domain: config.platform.domains[AppEnum.ADMIN],
            email: admin.email,
            token,
          },
          Attachments: [],
        })
      );
    });
  });
});
