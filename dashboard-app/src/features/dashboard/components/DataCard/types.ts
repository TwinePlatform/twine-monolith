
/*
 * Types
 */

export type TileDataPoint<T> = {
  label: string
  data: T
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
