import { useState, useEffect } from "react";
import EnhancedWaterfall from "@/components/Waterfall/EnhancedWaterfall";
import EnhancedImageCard from "@/components/ImageCard/EnhancedImageCard";
import styles from "./waterfall-demo.module.css";

const WaterfallDemo = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [demoMode, setDemoMode] = useState("basic"); // basic, virtual, custom

  // 模拟获取图片数据
  const fetchMoreImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 模拟分页数据
    const newImages = Array.from({ length: 12 }, (_, index) => ({
      id: images.length + index + 1,
      url: `https://picsum.photos/400/${
        Math.floor(Math.random() * 400) + 200
      }?random=${images.length + index + 1}`,
      alt: `风景图片${images.length + index + 1}`,
      height: Math.floor(Math.random() * 400) + 200,
    }));

    setImages((prev) => [...prev, ...newImages]);
    setPage((prev) => prev + 1);
    setLoading(false);

    // 模拟数据结束
    if (page >= 8) {
      setHasMore(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchMoreImages();
  }, []);

  // 图片加载成功回调
  const handleImageLoad = (imageId) => {
    console.log(`图片 ${imageId} 加载成功`);
  };

  // 图片加载失败回调
  const handleImageError = (imageId) => {
    console.error(`图片 ${imageId} 加载失败`);
  };

  // 下拉刷新
  const handleRefresh = async () => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    await fetchMoreImages();
  };

  // 切换演示模式
  const handleModeChange = (mode) => {
    setDemoMode(mode);
    handleRefresh();
  };

  return (
    <div className={styles.container}>
      {/* 头部控制面板 */}
      <div className={styles.header}>
        <h1>瀑布流组件演示</h1>
        <div className={styles.controls}>
          <button
            className={`${styles.modeButton} ${
              demoMode === "basic" ? styles.active : ""
            }`}
            onClick={() => handleModeChange("basic")}
          >
            基础瀑布流
          </button>
          <button
            className={`${styles.modeButton} ${
              demoMode === "virtual" ? styles.active : ""
            }`}
            onClick={() => handleModeChange("virtual")}
          >
            虚拟滚动
          </button>
          <button
            className={`${styles.modeButton} ${
              demoMode === "custom" ? styles.active : ""
            }`}
            onClick={() => handleModeChange("custom")}
          >
            自定义卡片
          </button>
          <button className={styles.refreshButton} onClick={handleRefresh}>
            刷新数据
          </button>
        </div>
        <div className={styles.stats}>
          <span>已加载: {images.length} 张图片</span>
          {!hasMore && <span className={styles.noMore}>已加载全部图片</span>}
        </div>
      </div>

      {/* 演示内容 */}
      <div className={styles.content}>
        {demoMode === "basic" && (
          <div className={styles.section}>
            <h2>基础瀑布流</h2>
            <p>响应式布局，自动适配不同屏幕尺寸</p>
            <EnhancedWaterfall
              images={images}
              fetchMore={fetchMoreImages}
              loading={loading}
              enableVirtualScroll={false}
            />
          </div>
        )}

        {demoMode === "virtual" && (
          <div className={styles.section}>
            <h2>虚拟滚动瀑布流</h2>
            <p>适合处理大量数据，提升性能</p>
            <EnhancedWaterfall
              images={images}
              fetchMore={fetchMoreImages}
              loading={loading}
              enableVirtualScroll={true}
            />
          </div>
        )}

        {demoMode === "custom" && (
          <div className={styles.section}>
            <h2>自定义ImageCard</h2>
            <p>支持图片预览、错误处理、骨架屏等功能</p>
            <div className={styles.customGrid}>
              {images.slice(0, 12).map((img) => (
                <EnhancedImageCard
                  key={img.id}
                  url={img.url}
                  title={img.alt}
                  height={img.height}
                  onLoad={() => handleImageLoad(img.id)}
                  onError={() => handleImageError(img.id)}
                  enablePreview={true}
                  showSkeleton={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 功能说明 */}
      <div className={styles.features}>
        <h3>功能特性</h3>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h4>🎯 响应式设计</h4>
            <p>根据屏幕宽度自动调整列数</p>
          </div>
          <div className={styles.feature}>
            <h4>⚡ 虚拟滚动</h4>
            <p>处理大量数据时提升性能</p>
          </div>
          <div className={styles.feature}>
            <h4>🖼️ 图片预览</h4>
            <p>点击图片可全屏预览</p>
          </div>
          <div className={styles.feature}>
            <h4>🔄 懒加载</h4>
            <p>IntersectionObserver实现高效懒加载</p>
          </div>
          <div className={styles.feature}>
            <h4>💀 骨架屏</h4>
            <p>提升加载体验</p>
          </div>
          <div className={styles.feature}>
            <h4>❌ 错误处理</h4>
            <p>图片加载失败时提供重试机制</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterfallDemo;
