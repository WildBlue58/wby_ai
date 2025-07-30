# 瀑布流组件使用指南

## 概述

这是一个功能强大的瀑布流组件，支持响应式布局、虚拟滚动、图片预览等功能。

## 基础用法

### 1. 基础瀑布流

```jsx
import EnhancedWaterfall from "@/components/Waterfall/EnhancedWaterfall";

const BasicExample = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMore = async () => {
    // 获取更多图片数据
    const newImages = await getImages();
    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <EnhancedWaterfall
      images={images}
      fetchMore={fetchMore}
      loading={loading}
      enableVirtualScroll={false}
    />
  );
};
```

### 2. 虚拟滚动瀑布流

```jsx
const VirtualScrollExample = () => {
  return (
    <EnhancedWaterfall
      images={images}
      fetchMore={fetchMore}
      loading={loading}
      enableVirtualScroll={true} // 启用虚拟滚动
    />
  );
};
```

### 3. 自定义 ImageCard

```jsx
import EnhancedImageCard from "@/components/ImageCard/EnhancedImageCard";

const CustomCardExample = () => {
  return (
    <div className="custom-grid">
      {images.map((img) => (
        <EnhancedImageCard
          key={img.id}
          url={img.url}
          title={img.alt}
          height={img.height}
          onLoad={() => console.log("图片加载成功")}
          onError={() => console.log("图片加载失败")}
          enablePreview={true}
          showSkeleton={true}
        />
      ))}
    </div>
  );
};
```

## 组件属性

### EnhancedWaterfall Props

| 属性                  | 类型       | 默认值  | 说明               |
| --------------------- | ---------- | ------- | ------------------ |
| `images`              | `Array`    | `[]`    | 图片数据数组       |
| `fetchMore`           | `Function` | -       | 获取更多数据的函数 |
| `loading`             | `Boolean`  | `false` | 是否正在加载       |
| `enableVirtualScroll` | `Boolean`  | `false` | 是否启用虚拟滚动   |

### EnhancedImageCard Props

| 属性            | 类型       | 默认值 | 说明             |
| --------------- | ---------- | ------ | ---------------- |
| `url`           | `String`   | -      | 图片 URL         |
| `title`         | `String`   | -      | 图片标题         |
| `height`        | `Number`   | `200`  | 图片高度         |
| `onLoad`        | `Function` | -      | 图片加载成功回调 |
| `onError`       | `Function` | -      | 图片加载失败回调 |
| `enablePreview` | `Boolean`  | `true` | 是否启用预览功能 |
| `showSkeleton`  | `Boolean`  | `true` | 是否显示骨架屏   |

## 数据格式

图片数据格式：

```javascript
const imageData = {
  id: 1, // 唯一标识
  url: "图片URL", // 图片地址
  alt: "图片标题", // 图片描述
  height: 300, // 图片高度（可选）
};
```

## 功能特性

### 🎯 响应式设计

- 自动根据屏幕宽度调整列数
- 移动端：1 列
- 平板：2 列
- 桌面：3-4 列

### ⚡ 虚拟滚动

- 适合处理大量数据（1000+图片）
- 只渲染可视区域内的图片
- 大幅提升性能

### 🖼️ 图片预览

- 点击图片可全屏预览
- 支持键盘 ESC 关闭
- 流畅的动画效果

### 🔄 懒加载

- 使用 IntersectionObserver 实现
- 提前 100px 触发加载
- 自动清理观察器

### 💀 骨架屏

- 图片加载前显示骨架屏
- 提升用户体验
- 可自定义样式

### ❌ 错误处理

- 图片加载失败时显示错误状态
- 提供重试按钮
- 友好的错误提示

## 自定义样式

### 修改瀑布流样式

```css
/* 自定义瀑布流容器 */
.wrapper {
  padding: 20px;
  background: #f5f5f5;
}

/* 自定义列样式 */
.column {
  gap: 20px;
}

/* 自定义加载动画 */
.spinner {
  border-color: #your-color;
}
```

### 修改图片卡片样式

```css
/* 自定义卡片样式 */
.card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 自定义预览遮罩 */
.previewOverlay {
  background: rgba(0, 0, 0, 0.8);
}
```

## 性能优化建议

1. **使用虚拟滚动**：当图片数量超过 1000 张时
2. **合理设置图片尺寸**：避免过大的图片文件
3. **启用懒加载**：减少初始加载时间
4. **使用 WebP 格式**：提升加载速度
5. **合理设置缓存**：减少重复请求

## 浏览器兼容性

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 79+

## 演示页面

访问 `/waterfall-demo` 查看完整的演示效果，包括：

- 基础瀑布流
- 虚拟滚动瀑布流
- 自定义 ImageCard
- 功能特性展示

## 常见问题

### Q: 如何禁用图片预览？

A: 设置 `enablePreview={false}`

### Q: 如何自定义列数？

A: 修改 `useResponsiveColumns` Hook 中的断点设置

### Q: 虚拟滚动不生效？

A: 确保设置了 `enableVirtualScroll={true}` 且容器有固定高度

### Q: 图片加载失败怎么办？

A: 组件会自动显示错误状态和重试按钮，也可以监听 `onError` 回调
