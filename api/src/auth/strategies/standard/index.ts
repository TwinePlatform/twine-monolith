import validate from './validate';
import { Sessions } from './session';
import { Credentials } from './credentials';
import { monitorSessionExpiry } from './monitoring';


const name = 'standard';


export {
  name,
  validate,
  monitorSessionExpiry,
  Sessions,
  Credentials,
};
