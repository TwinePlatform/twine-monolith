import * as Stream from 'stream';
import { LogEventsEnum, LogEvent } from './types';
import { formatError, formatResponse } from './formatters';


export default class GoodLogger extends Stream.Transform {
  constructor () {
    super({ objectMode: true });
  }

  _transform (data: LogEvent, encoding: string, next: Function) { // tslint:disable-line:function-name max-line-length
    switch (data.event) {
      case LogEventsEnum.ERROR:
        return next(null, formatError(data));

      case LogEventsEnum.RESPONSE:
        return next(null, formatResponse(data));
      default:
        break;
    }
  }
}

