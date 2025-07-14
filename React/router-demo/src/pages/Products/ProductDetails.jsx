import React from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();

  // 模拟产品数据
  const product = {
    id: productId,
    name: `产品${productId}`,
    price: 99.99 + productId * 50,
    description: `这是产品${productId}的详细描述。这是一个高质量的产品，具有优秀的性能和可靠的质量。`,
    category: "电子产品",
    stock: 100,
  };

  return (
    <div style={{ padding: "20px" }}>
      <Link
        to="/products"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#007bff",
          textDecoration: "none",
        }}
      >
        ← 返回产品列表
      </Link>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h1>{product.name}</h1>
        <div style={{ marginBottom: "15px" }}>
          <strong>价格:</strong> ¥{product.price}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>分类:</strong> {product.category}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>库存:</strong> {product.stock} 件
        </div>
        <div style={{ marginBottom: "20px" }}>
          <strong>描述:</strong>
          <p>{product.description}</p>
        </div>

        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          添加到购物车
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
