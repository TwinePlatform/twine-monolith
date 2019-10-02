import { omit } from 'ramda';
import { User } from '../../../models';

export default <T extends Partial<User>>(v: T) => omit(['password', 'qrCode'], v);
