import { useState } from "react";
// css in js
import styles from "./box.module.css";

const Box = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "Open"}
      </button>
      <div className={`${styles.box} ${isOpen ? styles.open : ""}`}></div>
    </div>
  );
};

export default Box;
