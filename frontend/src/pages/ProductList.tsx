import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts } from "../store/slice/productssSlice";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<"name" | "price" | "stock" | "createdAt">(
    "stock",
  );

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts({ name: filter, sortBy: sort, sortOrder: order }));
  }, [filter, sort, order, dispatch]);

  return (
    <Box p={4}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Product List
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <TextField
              label="Filter by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              size="small"
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
                <MenuItem value="createdAt">Date</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={order}
                onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                label="Order"
              >
                <MenuItem value="asc">Asc</MenuItem>
                <MenuItem value="desc">Desc</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/table")}
              sx={{ ml: "auto" }}
            >
              Product Table
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
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={`http://localhost:3000/uploads/${product.images}`}
                          alt={product.name}
                          width="50"
                          style={{ borderRadius: 4 }}
                        />
                      </TableCell>

                      <TableCell>{product.name}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductList;
