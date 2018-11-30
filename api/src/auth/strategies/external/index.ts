import validate from './validate';

type ExternalCredentials = {
  scope: string[],
  app: 'frontline',
};

export {
  validate,
  ExternalCredentials,
};
