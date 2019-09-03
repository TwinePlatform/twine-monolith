import * as Hapi from '@hapi/hapi';

type Record = {
  id: number
  name: string
}

export namespace Constants {
    export type getRequest = Hapi.Request
    export type getResponse = Record []
}
