export interface CardType {
  _id: string;
  title: string;
  description: string;
}

export interface ColumnType {
  _id: string;
  name: string;
  cards: CardType[];
}

export interface BoardType {
  _id: string;
  name: string;
  columns: ColumnType[];
}
