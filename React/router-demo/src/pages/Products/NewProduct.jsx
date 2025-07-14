import React, { useState } from "react";
import { Link } from "react-router-dom";

const NewProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("新产品数据:", formData);
    alert("产品添加成功！");
    // 这里可以添加实际的提交逻辑
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

      <h1>添加新产品</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            产品名称:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>价格:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>分类:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <option value="">请选择分类</option>
            <option value="电子产品">电子产品</option>
            <option value="服装">服装</option>
            <option value="家居">家居</option>
            <option value="图书">图书</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            库存数量:
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            产品描述:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          添加产品
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
