import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./enhanced-card.module.css";

const EnhancedImageCard = (props) => {
  const {
    url,
    height,
    title,
    onLoad,
    onError,
    enablePreview = true,
    showSkeleton = true,
  } = props;

  const imgRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // 懒加载逻辑
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const oImg = document.createElement("img");
          oImg.src = img.dataset.src;

          oImg.onload = function () {
            img.src = oImg.src;
            setImageLoaded(true);
            setImageDimensions({
              width: oImg.naturalWidth,
              height: oImg.naturalHeight,
            });
            onLoad?.();
          };

          oImg.onerror = function () {
            setImageError(true);
            onError?.();
          };

          obs.unobserve(img);
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [url, onLoad, onError]);

  // 图片预览处理
  const handleImageClick = useCallback(() => {
    if (enablePreview && imageLoaded && !imageError) {
      setShowPreview(true);
    }
  }, [enablePreview, imageLoaded, imageError]);

  // 关闭预览
  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  // 计算动态高度
  const calculateHeight = useCallback(() => {
    if (!height && imageDimensions.width && imageDimensions.height) {
      const containerWidth = 300; // 假设容器宽度
      return (containerWidth * imageDimensions.height) / imageDimensions.width;
    }
    return height || 200;
  }, [height, imageDimensions]);

  // 重试加载
  const handleRetry = useCallback(() => {
    setImageError(false);
    setImageLoaded(false);
    if (imgRef.current) {
      imgRef.current.src = "";
      imgRef.current.dataset.src = url;
    }
  }, [url]);

  return (
    <>
      <div
        className={`${styles.card} ${imageLoaded ? styles.fadeIn : ""}`}
        style={{ height: calculateHeight() }}
        onClick={handleImageClick}
      >
        {/* 骨架屏 */}
        {showSkeleton && !imageLoaded && !imageError && (
          <div className={styles.skeleton} />
        )}

        {/* 错误状态 */}
        {imageError && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>📷</div>
            <span className={styles.errorText}>图片加载失败</span>
            <button className={styles.retryButton} onClick={handleRetry}>
              重试
            </button>
          </div>
        )}

        {/* 图片 */}
        <img
          ref={imgRef}
          className={`${styles.img} ${imageLoaded ? styles.loaded : ""}`}
          data-src={url}
          alt={title}
          style={{ display: imageLoaded ? "block" : "none" }}
        />

        {/* 图片信息 */}
        {title && imageLoaded && (
          <div className={styles.imageInfo}>
            <span className={styles.imageTitle}>{title}</span>
          </div>
        )}

        {/* 预览指示器 */}
        {enablePreview && imageLoaded && !imageError && (
          <div className={styles.previewIndicator}>
            <span>👁️</span>
          </div>
        )}
      </div>

      {/* 图片预览遮罩 */}
      {showPreview && (
        <div className={styles.previewOverlay} onClick={handleClosePreview}>
          <div
            className={styles.previewContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleClosePreview}>
              ✕
            </button>
            <img src={url} alt={title} className={styles.previewImage} />
            {title && <div className={styles.previewTitle}>{title}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedImageCard;
