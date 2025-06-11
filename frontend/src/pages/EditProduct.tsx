import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  images: FileList | null;
}

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    images: null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        const { name, price, stock, description } = res.data;
        setForm((prev) => ({ ...prev, name, price, stock, description }));
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price.toString());
    formData.append("stock", form.stock.toString());
    formData.append("description", form.description);

    if (form.images) {
      Array.from(form.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      await axios.put(`http://localhost:3000/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated successfully");
      navigate("/table");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update product");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>

        <TextField
          name="name"
          label="Name *"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          name="description"
          label="Description *"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          name="price"
          label="Price *"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          name="stock"
          label="Stock *"
          type="number"
          value={form.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Typography variant="body1" sx={{ mt: 2 }}>
          Upload Image
        </Typography>
        <input
          name="images"
          type="file"
          multiple
          onChange={handleChange}
          style={{ marginTop: "8px", marginBottom: "16px" }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default EditProduct;
