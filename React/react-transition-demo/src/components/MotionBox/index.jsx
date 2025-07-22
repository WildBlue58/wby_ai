import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./motionbox.module.css";

const MotionBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "Open"}
      </button>
      <motion.div
        className={`${styles.motionbox} ${isOpen ? styles.open : ""}`}
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpen ? { height: 120, opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h1 className={styles.title}>Love❤️Xiang</h1>
      </motion.div>
    </div>
  );
};

export default MotionBox;
