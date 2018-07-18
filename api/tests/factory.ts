const { factory } = require('factory-girl');

factory.define('user', Object, {
  name: factory.chance('name'),
  password: factory.chance('string'),
  email: factory.chance('email'),
});

factory.define('organisation', Object, {
  name: factory.chance('name'),
  _360GivingId: factory.chance('string'),
});

export default factory;
