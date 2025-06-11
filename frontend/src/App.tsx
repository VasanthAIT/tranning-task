import { Box } from "@mui/material";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductTable from "./components/ProductTable";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ textAlign: "center", mt: 2 }}></Box>
      <Routes>
        <Route path="/list" element={<ProductList />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/table" element={<ProductTable />} />
      </Routes>
    </Router>
  );
};

export default App;
