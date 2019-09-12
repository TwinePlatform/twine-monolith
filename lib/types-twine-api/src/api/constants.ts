import * as Hapi from '@hapi/hapi'; // eslint-disable-line

type Record = {
  id: number
  name: string
};

// eslint-disable-next-line
export namespace Constants {
  export type getRequest = Hapi.Request;
  export type getResponse = Record [];
}
