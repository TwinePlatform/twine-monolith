import { assoc } from 'ramda';
import { User } from '../../../models';
import * as QRCode from '../../../services/qrcode';
import { noSecrets as noUserSecrets } from './user';

export const noSecrets = async <T extends Partial<User>>(v: T) => {
  const strippedUser = noUserSecrets(v);

  return v.qrCode
    ? assoc('qrCode', await QRCode.create(v.qrCode), strippedUser)
    : strippedUser;
};
