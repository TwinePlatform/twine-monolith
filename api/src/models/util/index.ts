import { WhereQuery, WhereBetweenQuery } from "../types";

export function isWhereBetween <T>(a: WhereQuery<T> | WhereBetweenQuery<T>): a is WhereBetweenQuery<T> {
  return Object.values(a).some((v) => Array.isArray(v));
}
