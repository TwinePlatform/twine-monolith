import get from './get';
import deleteTemp from './delete';
import passwordReset from './password_reset';
import register from './register';

export default [
  ...get,
  ...deleteTemp,
  ...passwordReset,
  ...register,
];
