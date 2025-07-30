import styles from "./waterfall.module.css";
import { useEffect, useRef, useState } from "react";
import ImageCard from "@/components/ImageCard";

const Waterfall = (props) => {
  const loader = useRef(null);
  const { images, fetchMore, loading } = props;
  useEffect(() => {
    // ref 出现在视窗了 intersectionObserver
    // 观察者模式
    const observer = new IntersectionObserver(([entry], obs) => {
      console.log(entry);
      if (entry.isIntersecting) {
        fetchMore();
      }
    //   obs.unobserve(entry.target);
    });
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [images]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          {images
            .filter((_, i) => i % 2 === 0)
            .map((img) => (
              <div key={img.id} className={styles.item}>
                <ImageCard url={img.url} title={img.alt} height={img.height} />
              </div>
            ))}
        </div>
        <div className={styles.column}>
          {images
            .filter((_, i) => i % 2 !== 0)
            .map((img) => (
              <div key={img.id} className={styles.item}>
                <ImageCard url={img.url} title={img.alt} height={img.height} />
              </div>
            ))}
        </div>
        <div ref={loader} className={styles.loader}>
          {loading && "Loading..."}
        </div>
      </div>
    </>
  );
};

export default Waterfall;
