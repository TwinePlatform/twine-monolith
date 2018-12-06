import * as Hapi from 'hapi';


export enum LogEventsEnum {
  LOG = 'log',
  ERROR = 'error',
  OPS = 'ops',
  RESPONSE = 'response',
  REQUEST = 'request',
}

export type ServerLogEvent = {
  event: 'log'
  timestamp: string
  id: string
  tags: string[]
  pid: number
} & ({ data: string | object } | { error: Error });

export type RequestErrorEvent = {
  event: 'error'
  timestamp: string
  id: string
  url: string
  method: Hapi.Util.HTTP_METHODS
  pid: number
  error: Error
  config: object
  headers: Hapi.Util.Dictionary<string>
};

export type RequestSentEvent = {
  event: 'response'
  timestamp: string
  id: string
  instance: string
  method: Hapi.Util.HTTP_METHODS
  path: string
  query: Hapi.RequestQuery
  responseTime: number
  statusCode: number
  pid: number
  httpVersion: string
  source: {
    remoteAddress: string
    userAgent: string
    referer: string
  }
  route: string
  tags: string[]
  config: object
  headers: Hapi.Util.Dictionary<string>
  requestPayload: object
  responsePayload: object
};

export type LogEvent =
  ServerLogEvent
  | RequestErrorEvent
  | RequestSentEvent
;

export type LogLine = {
  event: string
  method: Hapi.Util.HTTP_METHODS
  path?: string
  statusCode?: number
  origin?: string
  userId?: number
  organisationId?: number
  query?: string
  payload?: string
  response?: string
  errorMessage?: string
  errorStack?: string
};
