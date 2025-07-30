# 瀑布流组件快速启动指南

## 🚀 5 分钟快速上手

### 1. 安装依赖

确保项目中已安装必要的依赖：

```bash
npm install react react-dom
```

### 2. 基础使用

```jsx
import { useState, useEffect } from "react";
import EnhancedWaterfall from "@/components/Waterfall/EnhancedWaterfall";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 模拟获取图片数据
  const fetchMore = async () => {
    if (loading) return;

    setLoading(true);

    // 模拟API请求
    const newImages = Array.from({ length: 10 }, (_, index) => ({
      id: images.length + index + 1,
      url: `https://picsum.photos/300/${
        Math.floor(Math.random() * 300) + 200
      }?random=${images.length + index + 1}`,
      alt: `图片${images.length + index + 1}`,
      height: Math.floor(Math.random() * 300) + 200,
    }));

    setImages((prev) => [...prev, ...newImages]);
    setLoading(false);
  };

  // 初始化加载
  useEffect(() => {
    fetchMore();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>我的瀑布流</h1>
      <EnhancedWaterfall
        images={images}
        fetchMore={fetchMore}
        loading={loading}
      />
    </div>
  );
}

export default App;
```

### 3. 查看演示

访问 `http://localhost:3000/waterfall-demo` 查看完整演示。

## 📋 常用配置

### 启用虚拟滚动（适合大量数据）

```jsx
<EnhancedWaterfall
  images={images}
  fetchMore={fetchMore}
  loading={loading}
  enableVirtualScroll={true} // 启用虚拟滚动
/>
```

### 自定义图片卡片

```jsx
import EnhancedImageCard from "@/components/ImageCard/EnhancedImageCard";

// 在瀑布流外部使用
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  }}
>
  {images.map((img) => (
    <EnhancedImageCard
      key={img.id}
      url={img.url}
      title={img.alt}
      height={img.height}
      enablePreview={true}
      showSkeleton={true}
    />
  ))}
</div>;
```

## 🎯 核心功能

| 功能       | 说明             | 默认状态      |
| ---------- | ---------------- | ------------- |
| 响应式布局 | 自动适配屏幕尺寸 | ✅ 启用       |
| 懒加载     | 滚动到视口才加载 | ✅ 启用       |
| 图片预览   | 点击全屏预览     | ✅ 启用       |
| 骨架屏     | 加载前占位       | ✅ 启用       |
| 错误重试   | 加载失败可重试   | ✅ 启用       |
| 虚拟滚动   | 大量数据优化     | ❌ 需手动启用 |

## 🔧 自定义样式

### 修改瀑布流样式

```css
/* 在你的CSS文件中 */
.wrapper {
  padding: 24px;
  background: #f8f9fa;
}

.column {
  gap: 20px;
}

.loader {
  height: 100px;
}
```

### 修改图片卡片样式

```css
.card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.previewOverlay {
  background: rgba(0, 0, 0, 0.9);
}
```

## 📱 响应式断点

| 屏幕宽度        | 列数 | 适用设备 |
| --------------- | ---- | -------- |
| < 768px         | 1 列 | 手机     |
| 768px - 1023px  | 2 列 | 平板     |
| 1024px - 1439px | 3 列 | 小屏桌面 |
| ≥ 1440px        | 4 列 | 大屏桌面 |

## ⚡ 性能优化

1. **启用虚拟滚动**：当图片超过 1000 张时
2. **合理设置图片尺寸**：建议宽度 300-500px
3. **使用 WebP 格式**：提升加载速度
4. **设置合理的缓存策略**：减少重复请求

## 🐛 常见问题

### Q: 图片不显示？

A: 检查图片 URL 是否正确，网络是否正常

### Q: 滚动加载不触发？

A: 确保 `fetchMore` 函数正确实现，且 `loading` 状态正确

### Q: 虚拟滚动不生效？

A: 确保设置 `enableVirtualScroll={true}`

### Q: 样式不生效？

A: 检查 CSS 模块是否正确导入，类名是否正确

## 📞 获取帮助

- 查看完整文档：`/components/Waterfall/README.md`
- 访问演示页面：`/waterfall-demo`
- 查看源码：`/components/Waterfall/EnhancedWaterfall.jsx`

## 🎉 恭喜！

你已经成功集成了瀑布流组件！现在可以开始构建你的图片展示应用了。
