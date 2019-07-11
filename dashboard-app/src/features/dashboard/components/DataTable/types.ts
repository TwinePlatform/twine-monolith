/*
 * Types for the DataTable component
 */
import { Dictionary } from 'ramda';
import { Order } from 'twine-util/arrays';
import { TitleString } from '../Title';
import { Orderable } from '../../hooks/useOrderable';


/**
 * Public Types
 *
 * Define the public interface of the DataTable component
 */
export type DataTableProps = {
  title?: TitleString
  headers: string[]
  onChangeSortBy?: (s: string) => void
  rows: DataTableRow[]
  showTotals?: boolean
  orderable: Orderable
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
  sortBy?: number
  onClick?: DataTableCallback
};

export type TotalsRowProps = {
  rows: Pick<RowProps, 'columns' | 'order'>[]
};
