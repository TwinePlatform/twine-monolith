export type Nothing = null;
export type Maybe<T> = T | Nothing;
export type ValueOf<T> = T[keyof T];
export type Dictionary<T> = Record<string, T>;

// Extracts wrapped type. See:
// https://typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
export type Unpack<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U : T;


/*
 * Recursive definition of deep partial without breaking array types
 */
export type DeepPartial<T> = {
  [P in keyof T]?:
    T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>
};

export type Require<T, U extends keyof T> = Required<Pick<T, U>> & Omit<T, U>;

export type JsonPrimitives = null | boolean | number | string;
export interface JsonArray<T = JsonPrimitives> extends Array<Json<T>> {} // eslint-disable-line @typescript-eslint/no-empty-interface
export interface JsonObject<T = JsonPrimitives> { [key: string]: Json<T> }
export type Json<T = JsonPrimitives> = T | JsonArray<T> | JsonObject<T>;
export type EnhancedJson = Json<Date | JsonPrimitives>;


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
