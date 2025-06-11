import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputLabel,
} from "@mui/material";
import { isAxiosError } from "axios";
import imageCompression from "browser-image-compression";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProductWithImage } from "../services/productService";

const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }
  };

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
      const message = err.response?.data?.message;
      if (Array.isArray(message)) return message.join(", ");
      return message || err.message;
    }
    if (err instanceof Error) return err.message;
    return "An unexpected error occurred";
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price.trim()) newErrors.price = "Price is required";
    if (!stock.trim()) newErrors.stock = "Stock is required";
    if (!image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (image) {
      formData.append("image", image);
    }

    try {
      await createProductWithImage(formData);
      alert(" Product added successfully");
      navigate("/table");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      alert(" Failed to create product: " + errorMessage);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>
      <Box
        component="form"
        data-testid="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={!!errors.name}
          helperText={errors.name}
          inputProps={{ "data-testid": "name" }}
        />
        <TextField
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          error={!!errors.description}
          helperText={errors.description}
          inputProps={{ "data-testid": "description" }}
        />
        <TextField
          id="price"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          error={!!errors.price}
          helperText={errors.price}
          inputProps={{ "data-testid": "price" }}
        />
        <TextField
          id="stock"
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          error={!!errors.stock}
          helperText={errors.stock}
          inputProps={{ "data-testid": "stock" }}
        />
        <InputLabel>Upload Image</InputLabel>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          data-testid="images"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-testid="submit-button"
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default AddProduct;
