import { TextField, Button, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Product } from "../types/Product";

interface Props {
  initialData?: Product;
  onSubmit: (formData: FormData) => void;
  isEdit?: boolean;
}

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stocks: string;
}

const ProductForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<ProductFormState>({
    name: "",
    description: "",
    price: "",
    stocks: "",
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        stocks: initialData.stock?.toString() || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stocks);
    if (image) {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  return (
    <Stack spacing={2}>
      <TextField
        name="name"
        label="Name"
        value={form.name}
        onChange={handleChange}
      />
      <TextField
        name="description"
        label="Description"
        value={form.description}
        onChange={handleChange}
      />
      <TextField
        name="price"
        label="Price"
        value={form.price}
        onChange={handleChange}
      />
      <TextField
        name="stocks"
        label="Stock"
        value={form.stocks}
        onChange={handleChange}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Stack>
  );
};

export default ProductForm;
