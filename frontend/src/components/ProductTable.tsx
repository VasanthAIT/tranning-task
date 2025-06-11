import { Edit, Delete } from "@mui/icons-material";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { isAxiosError } from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getFilteredProducts, deleteProduct } from "../services/productService";
import { Product } from "../types/Product";

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(", ");
    return message || error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
};

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<"stock" | "name" | "price" | "createdAt">(
    "stock",
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const query = { name: filter, sortBy: sort, sortOrder: order };
      const data = await getFilteredProducts(query);
      setProducts(data);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [filter, sort, order]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err: unknown) {
        alert("Delete failed: " + getErrorMessage(err));
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: "100%", maxWidth: 1700 }}>
        <Typography variant="h4" gutterBottom>
          Product Table
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <TextField
            label="Filter by"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 200 }}
            size="small"
          />
          <Box>
            <InputLabel sx={{ fontSize: 12 }}>Sort By</InputLabel>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              size="small"
              sx={{ width: 150 }}
            >
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="createdAt">Created At</MenuItem>
            </Select>
          </Box>
          <Box>
            <InputLabel sx={{ fontSize: 12 }}>Sort Order</InputLabel>
            <Select
              value={order}
              onChange={(e) => setOrder(e.target.value as typeof order)}
              size="small"
              sx={{ width: 150 }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </Box>
          <Button variant="contained" onClick={fetchProducts}>
            Apply Filters
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/list")}
            sx={{ ml: "auto" }}
          >
            Product List
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add")}
            sx={{ ml: "auto" }}
          >
            Add Product
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>Images</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price (₹)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Stock</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created At</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Box
                        component="ul"
                        sx={{
                          display: "flex",
                          gap: 1,
                          padding: 0,
                          listStyle: "none",
                        }}
                      >
                        {product.images?.map((img, idx) => (
                          <li key={idx}>
                            <img
                              src={`http://localhost:3000/uploads/${img}`}
                              alt="product"
                              width="50"
                              height="50"
                              style={{
                                borderRadius: "8px",
                                objectFit: "cover",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                              }}
                            />
                          </li>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => navigate(`/edit/${product._id}`)}
                      >
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product._id)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ProductTable;
