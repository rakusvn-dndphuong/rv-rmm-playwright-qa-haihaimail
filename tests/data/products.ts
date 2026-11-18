import productsData from './products.json';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const products: Product[] = productsData;

export const getProductById = (id: number): Product => {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Product with id "${id}" not found in products.json`);
  return product;
};

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((p) => p.category === category);
