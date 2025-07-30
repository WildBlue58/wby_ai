import styles from "./toast.module.css";
import { useRef, useState, useEffect } from "react";
import { toastEvent } from "./toastController";

const Toast = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({
    user: 0,
    bell: 0,
    mail: 0,
  });

  useEffect(() => {
    const show = ({ user, bell, mail }) => {
      setData({ user, bell, mail });
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };
    // toastEvents 是 mitt 的实例
    // 自定义事件 show 是事件的名字
    // on 监听一个事件
    // 订阅了show的事件，订阅者
    toastEvent.on("show", show);
    return () => {
      toastEvent.off("show", show);
    };
  }, []);

  // 等着通信的到来
  // 事件机制
  if (!isVisible) return null;
  return (
    <div className={styles.toastWrapper}>
      <div className={styles.toastItem}>👤 {data.user}</div>
      <div className={styles.toastItem}>🔔 {data.bell}</div>
      <div className={styles.toastItem}>✉️ {data.mail}</div>
      <div className={styles.toastArrow}></div>
    </div>
  );
};

export default Toast;
