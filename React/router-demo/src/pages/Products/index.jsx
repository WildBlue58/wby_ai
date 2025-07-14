import React from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const products = [
    { id: 1, name: "产品1", price: 99.99 },
    { id: 2, name: "产品2", price: 149.99 },
    { id: 3, name: "产品3", price: 199.99 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>产品列表</h1>
      <Link
        to="/products/new"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        添加新产品
      </Link>

      <div style={{ display: "grid", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{product.name}</h3>
            <p>价格: ¥{product.price}</p>
            <Link
              to={`/products/${product.id}`}
              style={{
                color: "#007bff",
                textDecoration: "none",
              }}
            >
              查看详情
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
