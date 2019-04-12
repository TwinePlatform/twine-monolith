import Service from '..';
import { EmailTemplate } from '../templates';
import { getConfig } from '../../../../config';
import DispatcherMock from '../mocks/dispatcher';
import factory from '../../../../tests/utils/factory';
import { User, CommunityBusiness } from '../../../models';
import { AppEnum } from '../../../types/internal';


describe('Email Service', () => {
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(() => {
    jest.mock('../dispatcher.ts', () => DispatcherMock);
  });

  afterAll(() => {
    jest.unmock('../dispatcher.ts');
  });

  describe.only('newVisitor', () => {
    test('sends two emails', async () => {
      const visitor: User = await factory.build('visitor');
      const admin: User = await factory.build('cbAdmin');
      const cb: CommunityBusiness = await factory.build('communityBusiness');
      const attachment = 'fake';

      await Service.newVisitor(config, visitor, admin, cb, attachment);

      expect(DispatcherMock.sendBatch).toHaveBeenCalledTimes(1);
      expect(DispatcherMock.sendBatch).toHaveBeenCalledWith([
        expect.objectContaining({
          to: visitor.email,
          templateId: EmailTemplate.WELCOME_VISITOR,
          templateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            name: visitor.name,
            organisation: cb.name,
          },
          attachments: [expect.objectContaining({ content: attachment })],
        }),
        expect.objectContaining({
          to: admin.email,
          templateId: EmailTemplate.NEW_VISITOR_CB_ADMIN,
          templateModel: {
            domain: config.platform.domains[AppEnum.VISITOR],
            name: visitor.name,
            email: visitor.email,
          },
          attachments: [expect.objectContaining({ content: attachment })],
        }),
      ]);
    });
  });

  describe('visitorReminder', () => {});
  describe('newVolunteer', () => {});
  describe('newCbAdmin', () => {});
  describe('addRole', () => {});
  describe('resetPassword', () => {});
});
