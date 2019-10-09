import { ValueOf } from "../../types/internal";

export type DateLike = Date | number;

export type WhereQuery<T> = Partial<T>;
export type WhereBetweenQuery<T> = Partial<{ [k in keyof T]: [DateLike, DateLike] }>;
export type FieldSpec<T> = (keyof T)[];

export type PaginationQuery<T> = {
  limit: number;
  offset: number;
  order: [keyof T, 'asc' | 'desc'];
}

export type WhereQueries<T> = {
  where: WhereQuery<T>;
  whereNot: WhereQuery<T>;
  whereBetween: WhereBetweenQuery<T>;
  whereNotBetween: WhereBetweenQuery<T>;
}

export type SimpleModelQuery<T> = Partial<WhereQueries<T>>;
export type ModelQueryPartial<T> = Partial<PaginationQuery<T> & WhereQueries<T>> & { fields: FieldSpec<T> };
export type ModelQuery<T> = Omit<ModelQueryPartial<T>, 'fields'>;
export type ModelQueryValues<T> = ValueOf<WhereQuery<T> | WhereBetweenQuery<T>>;
