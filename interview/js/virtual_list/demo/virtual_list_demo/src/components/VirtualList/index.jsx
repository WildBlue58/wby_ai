import { useRef, useState, useCallback } from "react";

const VirtualList = ({
  data,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = data.length * itemHeight;

  // 计算可见区域
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  // 计算偏移量
  const offset = startIndex * itemHeight;

  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{
        height,
        overflowY: "auto",
        position: "relative",
        // 性能优化点 新的图层
        willChange: "transform",
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offset}px)`,
          }}
        >
          {data.slice(startIndex, endIndex + 1).map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem ? renderItem(item, startIndex + index) : item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
