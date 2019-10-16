import { omit } from 'ramda';
import { User } from '../../../models';

export const noSecrets = <T extends Partial<User>>(v: T) => omit(['password', 'qrCode'], v);
