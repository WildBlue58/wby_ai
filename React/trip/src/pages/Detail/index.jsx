import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDetailStore } from "@/store/useDetailStore";
import useTitle from "@/hooks/useTitle";
import { Skeleton } from "react-vant";
// import styles from "./detail.module.css";

const Detail = () => {
  const { id } = useParams(); // 返回URL的参数对象进行解构
  const { detail, loading, setDetail } = useDetailStore();
  const navigate = useNavigate();

  useEffect(() => {
    useTitle(detail?.title || "详情页面");
  }, [detail]);

  useEffect(() => {
    if (id) {
      setDetail(id);
    }
  }, [id, setDetail]);

  if (loading) return <Skeleton />;

  return (
    <div>
      <div className="detail-header">
        <div className="detail-header-left">
          <button onClick={() => navigate(-1)}>返回</button>
        </div>
      </div>
      {detail && (
        <div className="detail-content">
          <h1>{detail.title}</h1>
          <p className="price">¥{detail.price}</p>
          <p className="description">{detail.desc}</p>
          {detail.images && detail.images.length > 0 && (
            <div className="images">
              {detail.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detail;
