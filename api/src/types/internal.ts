export type Nothing = null;
export type Maybe<T> = T | Nothing;

export type Map<K extends string | number | symbol, V> = {
  [k in K]: V
};

export type Dictionary<T> = {
  [key: string]: T
};

export type ValueOf<T> = T[keyof T];

/*
 * Recursive definition of deep partial without breaking array types
 */
export type DeepPartial<T> = {
  [P in keyof T]?:
    // tslint:disable-next-line:prefer-array-literal
    T[P] extends Array<infer U>
      // tslint:disable-next-line:prefer-array-literal
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>
};

export type JsonPrimitives =
  string
  | number
  | boolean
  | null;

export type JsonTypes =
  JsonPrimitives
  | Dictionary<JsonPrimitives>
  | JsonPrimitives[];

export type Json = Dictionary<JsonTypes> | Dictionary<JsonTypes>[] | JsonTypes[];

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type Day =
  'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export enum AppEnum {
  TWINE_API = 'TWINE_API',
  VISITOR = 'VISITOR_APP',
  VOLUNTEER = 'VOLUNTEER_APP',
  DASHBOARD = 'DASHBOARD_APP',
  ADMIN = 'ADMIN_APP',
}

/*
 * Aliases
 *
 * These aren't useful for type inference but are useful for readability
 * and communicating intent
 */
export type Int = number;
export type Float = number;
