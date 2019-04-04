import { AppEnum } from '../../types/internal';


export enum EmailTemplate {
  NEW_VISITOR_TWINE_ADMIN = 4251043,
  NEW_VISITOR_CB_ADMIN = 3853062,
  PWD_RESET_VISITOR_APP = 4148361,
  PWD_RESET_ADMIN_APP = 8786293,
  PWD_RESET_DASHBOARD_APP = 10762183,
  WELCOME_CB_ADMIN = 4010082,
  WELCOME_VISITOR = 3843402,
  NEW_ROLE_CONFIRM = 10757501,
}


export const Templates = {
  passwordResetForApp: (app: AppEnum) => {
    switch (app) {
      case AppEnum.VISITOR:
        return EmailTemplate.PWD_RESET_VISITOR_APP;

      case AppEnum.ADMIN:
        return EmailTemplate.PWD_RESET_ADMIN_APP;

      case AppEnum.DASHBOARD:
        return EmailTemplate.PWD_RESET_DASHBOARD_APP;

      case AppEnum.TWINE_API:
      case AppEnum.VOLUNTEER:
      default:
        throw new Error(`Unsupported application: ${app}`);
    }
  },
};
