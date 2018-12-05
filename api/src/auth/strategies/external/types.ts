export type ExternalAppCredentials = {
  scope: string[],
  app: 'frontline',
};

export type ApiTokenRow = {
  api_token: string,
  api_token_access: string,
  api_token_name: string,
};
