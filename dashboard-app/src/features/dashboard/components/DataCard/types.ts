
/*
 * Types
 */

export type TileDataPoint<T> = {
  label: string
  data: T
  limit?: number
  placeholder?: string
};

export type NumberTileProps = {
  topText: string []
  left: TileDataPoint<string[]>
  right: TileDataPoint<number>
  bottomText?: string []
};

export type TextTileProps = {
  topText: string []
  left: TileDataPoint<string[]>
  right: TileDataPoint<string[]>
  bottomText?: string []
};
