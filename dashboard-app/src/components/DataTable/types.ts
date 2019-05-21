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
export type DataTableProps = {
  title?: string
  headers: string[]
  initialOrder?: Order
  sortBy?: string
  onChangeSortBy?: (s: string) => void
  rows: DataTableRow[]
  showTotals?: boolean
};

export type DataTableContent = number | string;

export type DataTableCallback = (f: DataTableContent) => void;

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


/**
 * Internal Types
 *
 * Define internal types used by sub-components
 */
export type CellProps = DataTableCell & {
  colour?: string
  onClick?: DataTableCallback
};

export type RowProps = {
  columns: Dictionary<CellProps>
  order: string[]
  rowLink?: string
  onClick?: DataTableCallback
};


export type HeaderRowProps = {
  columns: CellProps[]
  order?: Order
  sortBy?: string
  onClick?: DataTableCallback
};

export type TotalsRowProps = {
  rows: Pick<RowProps, 'columns' | 'order'>[]
};
