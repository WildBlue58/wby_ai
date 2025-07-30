import styles from "./card.module.css";
import { useRef, useEffect } from "react";

const ImageCard = (props) => {
  const { url, height } = props;
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const oImg = document.createElement("img");
        oImg.src = img.dataset.src;
        oImg.onload = function () {
          img.src = oImg.src;
        };
        obs.unobserve(img);
      }
    });
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
  }, [url]);

  return (
    <div className={styles.card} style={{ height }}>
      <img
        ref={imgRef}
        className={styles.img}
        data-src={url}
        alt={props.title}
      />
    </div>
  );
};

export default ImageCard;
