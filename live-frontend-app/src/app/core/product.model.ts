export interface Product {
  id?: number; // optional for new products
  name: string;
  description?: string;
  price: number;
  category?: string;
  live?: boolean;
  stock?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
