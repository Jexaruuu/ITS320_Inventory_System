export interface Item {
  _id?: string;
  name: string;
  categoryId: string;
  quantity: number;
  price: number;
  image?: string;
}
