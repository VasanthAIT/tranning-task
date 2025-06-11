import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  images?: string;
  createdAt: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const API_URL = "http://localhost:3000/products";

interface ProductQueryParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "stock" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const fetchProducts = createAsyncThunk<
  Product[],
  ProductQueryParams | undefined
>("product/fetchProducts", async (params) => {
  const response = await axios.get<Product[]>(API_URL, { params });
  return response.data;
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default productSlice.reducer;
