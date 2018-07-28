export type Nothing = null;
export type Maybe<T> = T | Nothing;

export type Map<K extends string | number, V> = {
  [k in K]: V
}

export type Dictionary<T> = {
  [key: string]: T
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type JsonPrimitives =
  string
  | number
  | boolean
  | null

export type JsonTypes =
  JsonPrimitives
  | Dictionary<JsonPrimitives>
  | JsonPrimitives[]

export type Json = Dictionary<JsonTypes> | Dictionary<JsonTypes>[] | JsonTypes[]

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
