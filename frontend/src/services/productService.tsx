import axios from "axios";
import { Product } from "../types/Product";

const API = "http://localhost:3000/products";

type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: File | null;
}

export const getFilteredProducts = async (
  query: QueryParams,
): Promise<Product[]> => {
  const params = new URLSearchParams(
    query as Record<string, string>,
  ).toString();
  const response = await axios.get(`${API}/filter?${params}`);
  return response.data;
};

export const getProductById = (id: string): Promise<{ data: Product }> =>
  axios.get(`${API}/${id}`);

export const createProduct = (data: ProductInput): Promise<{ data: Product }> =>
  axios.post(API, data);

export const createProductWithImage = (
  formData: FormData,
): Promise<{ data: Product }> => axios.post(`${API}/single`, formData);

export const updateProduct = (
  id: string,
  formData: FormData,
): Promise<{ data: Product }> =>
  axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id: string): Promise<void> =>
  axios.delete(`${API}/${id}`);
