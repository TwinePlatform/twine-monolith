import { assoc } from 'ramda';
import { User } from '../../../models';
import * as QRCode from '../../../services/qrcode';
import userSerialiser from './user';

export default async <T extends Partial<User>>(v: T) => {
  const strippedUser = userSerialiser(v);

  return v.qrCode
    ? assoc('qrCode', await QRCode.create(v.qrCode), strippedUser)
    : strippedUser;
};
