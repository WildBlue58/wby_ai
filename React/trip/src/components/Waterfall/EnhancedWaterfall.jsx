import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import styles from "./waterfall.module.css";
import ImageCard from "@/components/ImageCard";

// 自定义Hook：IntersectionObserver
const useIntersectionObserver = (callback, deps = []) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      },
      {
        rootMargin: "100px", // 提前100px触发
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, deps);

  return observerRef.current;
};

// 自定义Hook：响应式列数
const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else if (width < 1440) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return columns;
};

// 虚拟滚动Hook
const useVirtualScroll = (items, itemHeight = 300, containerHeight = 600) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index,
      style: {
        position: "absolute",
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
      },
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  return { visibleItems, setScrollTop };
};

const EnhancedWaterfall = (props) => {
  const { images, fetchMore, loading, enableVirtualScroll = false } = props;
  const loader = useRef(null);
  const containerRef = useRef(null);

  // 响应式列数
  const columns = useResponsiveColumns();

  // 虚拟滚动
  const { visibleItems, setScrollTop } = useVirtualScroll(
    images,
    300,
    window.innerHeight
  );

  // 分组图片到不同列
  const columnImages = useMemo(() => {
    const result = Array.from({ length: columns }, () => []);
    const items = enableVirtualScroll ? visibleItems : images;

    items.forEach((img, index) => {
      const columnIndex = index % columns;
      result[columnIndex].push(img);
    });

    return result;
  }, [images, columns, enableVirtualScroll, visibleItems]);

  // 滚动处理
  const handleScroll = useCallback(
    (e) => {
      if (enableVirtualScroll) {
        setScrollTop(e.target.scrollTop);
      }
    },
    [enableVirtualScroll, setScrollTop]
  );

  // IntersectionObserver
  const observer = useIntersectionObserver(
    useCallback(() => {
      if (!loading) {
        fetchMore();
      }
    }, [fetchMore, loading]),
    [fetchMore, loading]
  );

  useEffect(() => {
    if (loader.current && observer) {
      observer.observe(loader.current);
    }
  }, [observer, images]);

  // 渲染列
  const renderColumn = (columnImages, columnIndex) => (
    <div key={columnIndex} className={styles.column}>
      {columnImages.map((img, imgIndex) => (
        <div
          key={`${columnIndex}-${img.id}-${imgIndex}`}
          className={styles.item}
          style={enableVirtualScroll ? img.style : {}}
        >
          <ImageCard
            url={img.url}
            title={img.alt}
            height={img.height}
            onLoad={() => {
              // 图片加载完成后的回调
              console.log(`Image ${img.id} loaded`);
            }}
            onError={() => {
              // 图片加载失败的处理
              console.error(`Image ${img.id} failed to load`);
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={styles.wrapper}
      onScroll={enableVirtualScroll ? handleScroll : undefined}
      style={
        enableVirtualScroll
          ? {
              height: "100vh",
              overflow: "auto",
              position: "relative",
            }
          : {}
      }
    >
      <div className={styles.columnsContainer}>
        {columnImages.map((column, index) => renderColumn(column, index))}
      </div>

      {/* 加载更多指示器 */}
      <div ref={loader} className={styles.loader}>
        {loading ? (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <span>加载中...</span>
          </div>
        ) : (
          <span>上拉加载更多</span>
        )}
      </div>
    </div>
  );
};

export default EnhancedWaterfall;
