/*
 * Types for the DataTable component
 */
import { Dictionary } from 'ramda';

/**
 * Basic Types
 */
export type Order = 'desc' | 'asc';

/**
 * Public Types
 *
 * Define the public interface of the DataTable component
 */
export type DataTableContent = number | string;

export type DataTableCell = {
  content: DataTableContent
  cellLink?: string
};

export type DataTableRow = {
  rowLink?: string
  columns: {
    [k in string]: DataTableCell
  }
};

export type DataTableProps = {
  title?: string
  headers: string[]
  initialOrder?: Order
  initialSortColumn?: string
  rows: DataTableRow[]
};

/**
 * Internal Types
 *
 * Define internal types used by sub-components
 */
export type CellProps = DataTableCell & {
  colour?: string
  prefix?: string
  onClick?: (f: CellProps['content']) => void
};

export type RowProps = {
  columns: Dictionary<CellProps>
  order: string[]
  alternateColour: boolean
  rowLink?: string
};


export type HeaderRowProps = {
  columns: CellProps[]
  active: string
  order: Order
  onClick?: (f: DataTableContent) => void
};
