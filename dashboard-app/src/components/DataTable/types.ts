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
export type DataTableContent = number | string

export type DataTableCol = {
  content: DataTableContent
  cellLink?: string
};

export type DataTableRow = {
  rowLink?: string
  columns: {
    [k in string]: DataTableCol
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
export type ColumnProps = DataTableCol & {
  prefix?: string
  onClick?: (f: ColumnProps['content']) => void
};

export type RowProps = {
  columns: Dictionary<ColumnProps>
  order: string[]
  alternateColour: boolean
  rowLink?: string
};


export type HeaderRowProps = {
  columns: ColumnProps[]
  active: string
  order: Order
  onClick?: (f: DataTableContent) => void
}
