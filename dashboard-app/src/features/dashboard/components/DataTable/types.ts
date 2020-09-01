/*
 * Types for the DataTable component
 */
import { Dictionary } from 'ramda';
import { Order } from 'twine-util/arrays';
import { TitleString } from '../Title';


/**
 * Public Types
 *
 * Define the public interface of the DataTable component
 */
export type DataTableProps = {
  title?: TitleString
  headers: string[]
  sortBy?: string
  order?: Order
  onChangeSortBy?: (s: string) => void
  rows: DataTableRow[]
  showTotals?: boolean
};

export type LogsDataTableProps = {
  title?: TitleString
  headers: string[]
  sortBy?: string
  order?: Order
  onChangeSortBy?: (s: string) => void
  rows: DataTableRow[]
  showTotals?: boolean
  setSelectedLog: any
  setLogViewModalVisible: any
};

export type ProjectsDataTableProps = {
  title?: TitleString
  headers: string[]
  sortBy?: string
  order?: Order
  onChangeSortBy?: (s: string) => void
  rows: DataTableRow[]
  showTotals?: boolean
};

export type UsersDataTableProps = {
  title?: TitleString
  headers: string[]
  sortBy?: string
  order?: Order
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
  columns: Dictionary<DataTableCell>
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

export type LogsRowProps = {
  columns: Dictionary<CellProps>
  order: string[]
  rowLink?: string
  onClick?: DataTableCallback
  setSelectedLog: any
  setLogViewModalVisible: any
  rowNumber: number
};

export type ProjectsRowProps = {
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
