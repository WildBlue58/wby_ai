# React transition

- transition 声明
- 值的改变

---

## framer-motion 动画库简介

- framer-motion 是 React 生态中非常流行的动画库，提供了更强大、声明式的动画能力，适合复杂的交互和动画场景。
- 基本用法：通过 motion 组件（如 motion.div）包裹元素，使用 initial、animate、transition 等属性声明动画的起始、结束状态和过渡参数。
- 与 CSS transition 的对比：
  - CSS transition 适合简单的样式过渡，如高度、宽度、颜色等属性的平滑变化。
  - framer-motion 支持更复杂的动画序列、物理效果、手势交互、拖拽等高级动画。

## 示例：MotionBox 组件

```jsx
import { motion } from "framer-motion";

const MotionBox = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        backgroundColor: "skyblue",
        padding: 20,
      }}
    >
      <h1>Love Xiang</h1>
    </motion.div>
  );
};
```

### 主要属性说明

- `initial`：动画初始状态
- `animate`：动画结束状态
- `transition`：动画过渡参数（如持续时间、缓动函数等）

---

## 总结

- 简单动画可以用 CSS transition 实现，复杂动画推荐使用 framer-motion 等第三方库。

---

## CSS transition 与 Framer-motion 对比

### 1. 使用 CSS transition 实现动画

以高度展开/收起为例：

```jsx
// Box.jsx
import { useState } from "react";
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
```

```css
/* box.module.css */
.box {
  width: 100px;
  height: 0;
  background-color: lightblue;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}
.box.open {
  height: 100px;
}
```

**说明**：通过切换 class，利用 CSS transition 实现高度的平滑过渡，适合简单动画。

---

### 2. 使用 Framer-motion 实现动画

```jsx
// MotionBox.jsx
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
```

**说明**：通过 motion.div 的 initial、animate、transition 属性，声明式地控制动画状态，支持更多动画属性和复杂交互。

---

### 3. 对比总结

| 对比项     | CSS transition         | Framer-motion                |
| ---------- | ---------------------- | ---------------------------- |
| 代码复杂度 | 简单，适合基础动画     | 稍复杂，适合复杂动画         |
| 动画能力   | 仅支持有限的 CSS 属性  | 支持更多属性、物理效果、序列 |
| 交互性     | 仅能通过 class 切换    | 支持手势、拖拽、动画联动等   |
| 维护性     | 适合简单场景，难以扩展 | 结构清晰，易于扩展和维护     |
| 依赖       | 无需额外依赖           | 需安装 framer-motion 库      |

**结论**：

- 简单动画推荐 CSS transition，代码简洁、性能好。
- 复杂动画、交互推荐 Framer-motion，功能强大、声明式易维护。

## 这篇博客已写完
