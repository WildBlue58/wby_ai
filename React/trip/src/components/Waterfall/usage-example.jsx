import { useState, useEffect } from "react";
import EnhancedWaterfall from "./EnhancedWaterfall";
import EnhancedImageCard from "../ImageCard/EnhancedImageCard";

// 模拟数据
const mockImages = [
  {
    id: 1,
    url: "https://picsum.photos/300/400?random=1",
    alt: "风景图片1",
    height: 400,
  },
  {
    id: 2,
    url: "https://picsum.photos/300/300?random=2",
    alt: "风景图片2",
    height: 300,
  },
  {
    id: 3,
    url: "https://picsum.photos/300/500?random=3",
    alt: "风景图片3",
    height: 500,
  },
  // ... 更多图片
];

const WaterfallUsageExample = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 模拟获取图片数据
  const fetchMoreImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 模拟分页数据
    const newImages = Array.from({ length: 10 }, (_, index) => ({
      id: images.length + index + 1,
      url: `https://picsum.photos/300/${
        Math.floor(Math.random() * 300) + 200
      }?random=${images.length + index + 1}`,
      alt: `风景图片${images.length + index + 1}`,
      height: Math.floor(Math.random() * 300) + 200,
    }));

    setImages((prev) => [...prev, ...newImages]);
    setPage((prev) => prev + 1);
    setLoading(false);

    // 模拟数据结束
    if (page >= 5) {
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

  return (
    <div className="waterfall-example">
      {/* 控制面板 */}
      <div className="controls">
        <button onClick={handleRefresh}>刷新</button>
        <span>已加载 {images.length} 张图片</span>
        {!hasMore && <span>已加载全部图片</span>}
      </div>

      {/* 基础瀑布流 */}
      <div className="section">
        <h3>基础瀑布流</h3>
        <EnhancedWaterfall
          images={images}
          fetchMore={fetchMoreImages}
          loading={loading}
          enableVirtualScroll={false}
        />
      </div>

      {/* 虚拟滚动瀑布流 */}
      <div className="section">
        <h3>虚拟滚动瀑布流（适合大量数据）</h3>
        <EnhancedWaterfall
          images={images}
          fetchMore={fetchMoreImages}
          loading={loading}
          enableVirtualScroll={true}
        />
      </div>

      {/* 自定义ImageCard */}
      <div className="section">
        <h3>自定义ImageCard示例</h3>
        <div className="custom-cards">
          {images.slice(0, 6).map((img) => (
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
    </div>
  );
};

export default WaterfallUsageExample;
