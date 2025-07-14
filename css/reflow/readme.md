# 回流重绘

- 布局的难点 列式布局和理解 BFC/FFC
  - html 根元素 最外层的第一个 BFC 元素
    Block Formatting Context 块级从上到下，行内从左到右，BFC 格式化上下文
    有了文档流
  - float overflow:hidden flex
  - 有没有什么标签 可以做列式布局 table
    tr td
  - 为什么不用？
    - 触发太多的回流和重绘
    - 语义不和 table 数据表
      tr row
      td column
    - 不够灵活

## 回流和重绘

- 回流 重排 reflow
  当 RenderTree 中部分或全部元素的尺寸，结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程叫回流
  table 不适合，table 中局部的改变，会触发整个 table 的回流重排
  火烧赤壁
  display:none 不参与回流重绘 性能优化的一种方案

  - 触发回流(重排 reflow)的方式

  1. 页面首次渲染 严格意义不是 0 , -> 有 最耗时 网页每慢 0.1s 少 1000 万 2.浏览器窗口的大小改变 3.元素尺寸或位置发生改变(transition,transform/opacity 新图层除外) 4.元素内容的变化
     appendChild removeChild
     5.display:none -> block 6.字体大小的变化 7.激活 CSS 伪类 :hover
     color:? 浏览器需要重新计算元素的样式和布局 8.查询某些属性或调用某些方法时

  - img.getBoundingClientRect() 触发回流
    ret{}

- 重绘 repaint
  当页面元素样式的改变并不影响他在文档流中的位置
  color background-color visibility hidden show

## 页面是怎么渲染的?

- 输入 url
- 下载 html
  - 下载字节
  - html 字符 UTF-8 编码
  - 解析 html 开关标签 属性...
  - 节点对象
  - 构建 DOM 树
- link css 下载 css
  - 下载字节码 Content-Type text/html text/css
  - 编码 utf-8 得到 CSS 文本
  - token 词法分析
  - css rule 节点
  - cssOM 树
  - RenderTree
  - Layout 树
    布局 盒模型 大小 确定元素在文档流中的位置和大小
  - 图层
    - z-index
    - position:fixed 弹窗
    - transition + transform / opacity
      animation
  - translate(50%,50%,50%) Z GPU 加速
    1 个图层 主要文档流图层 = DOM 树 + CSSOM -> RenderTree <-> LayoutTree
    2 个图层 = DOM 树 + CSSOM -> RenderTree <-> LayoutTree
    ....
  - 图层的合并
  - 浏览器的渲染引擎 绘制平面 像素点绘制

## 代码演示

### 1. Table 布局 vs Flex 布局对比

**Table 布局（不推荐）- 容易触发回流：**

```html
<!-- 问题：局部改变会触发整个table回流 -->
<table class="table-layout">
  <tr>
    <td class="sidebar">左侧边栏</td>
    <td class="main">主内容区域</td>
    <td class="sidebar">右侧边栏</td>
  </tr>
</table>

<style>
  .table-layout {
    width: 100%;
    border-collapse: collapse;
  }
  .table-layout td {
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>

<script>
  // 改变table内容会触发整个table回流
  function changeTableContent() {
    const mainCell = document.querySelector(".table-layout .main");
    mainCell.textContent = "内容已改变 - 整个table重新计算布局";
    mainCell.style.backgroundColor = "#ffcccc";
  }
</script>
```

**Flex 布局（推荐）- 减少回流：**

```html
<!-- 优势：局部改变不影响整体布局 -->
<div class="modern-layout">
  <div class="modern-sidebar">左侧边栏</div>
  <div class="modern-main">主内容区域</div>
  <div class="modern-sidebar">右侧边栏</div>
</div>

<style>
  .modern-layout {
    display: flex;
    gap: 10px;
  }
  .modern-sidebar {
    flex: 0 0 20%;
    background-color: #f0f0f0;
  }
  .modern-main {
    flex: 1;
    background-color: #e0e0e0;
  }
</style>

<script>
  // 改变flex内容只影响当前元素
  function changeFlexContent() {
    const mainDiv = document.querySelector(".modern-main");
    mainDiv.textContent = "内容已改变 - 只影响当前元素";
    mainDiv.style.backgroundColor = "#ccffcc";
  }
</script>
```

### 2. 回流（Reflow）演示

```css
/* 回流触发演示 */
.reflow-demo {
  border: 2px solid #ff6b6b;
  padding: 15px;
  margin: 10px 0;
  transition: all 0.3s ease;
}

.reflow-demo:hover {
  width: 300px; /* 触发回流 - 改变尺寸 */
  height: 100px; /* 触发回流 - 改变尺寸 */
  background-color: #ff6b6b;
  color: white;
}
```

```javascript
// 手动触发回流
function triggerReflow() {
  const demo = document.getElementById("reflowDemo");
  demo.style.width = "400px"; // 触发回流
  demo.style.height = "80px"; // 触发回流
  demo.style.marginLeft = "50px"; // 触发回流
  demo.textContent = "回流已触发 - 尺寸和位置都改变了";
}
```

### 3. 重绘（Repaint）演示

```css
/* 重绘演示 */
.repaint-demo {
  border: 2px solid #4ecdc4;
  padding: 15px;
  margin: 10px 0;
  transition: all 0.3s ease;
}

.repaint-demo:hover {
  background-color: #4ecdc4; /* 只触发重绘 - 不影响布局 */
  color: white; /* 只触发重绘 - 不影响布局 */
}
```

```javascript
// 手动触发重绘
function triggerRepaint() {
  const demo = document.getElementById("repaintDemo");
  demo.style.backgroundColor = "#ff6b6b"; // 只重绘
  demo.style.color = "white"; // 只重绘
  demo.textContent = "重绘已触发 - 只改变了颜色";
}
```

### 4. GPU 加速演示

```css
/* GPU加速演示 */
.gpu-demo {
  border: 2px solid #45b7d1;
  padding: 15px;
  margin: 10px 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.gpu-demo:hover {
  transform: translateX(20px); /* GPU加速 - 创建新图层 */
  opacity: 0.8; /* GPU加速 - 创建新图层 */
}
```

```javascript
// 触发GPU加速
function triggerGPU() {
  const demo = document.getElementById("gpuDemo");
  demo.style.transform = "translateX(100px) rotate(10deg)"; // GPU加速
  demo.style.opacity = "0.6"; // GPU加速
  demo.textContent = "GPU加速已触发 - 使用transform和opacity";
}
```

### 5. 性能优化代码示例

**避免频繁查询布局信息：**

```javascript
// ❌ 错误做法 - 每次查询都触发回流
function badLayoutQuery() {
  const element = document.getElementById("demo");
  for (let i = 0; i < 100; i++) {
    const rect = element.getBoundingClientRect(); // 每次调用都触发回流
    console.log(`第${i + 1}次查询:`, rect);
  }
}

// ✅ 正确做法 - 缓存布局信息
function goodLayoutQuery() {
  const element = document.getElementById("demo");
  const rect = element.getBoundingClientRect(); // 只查询一次
  for (let i = 0; i < 100; i++) {
    console.log(`第${i + 1}次使用:`, rect);
  }
}
```

**批量修改 DOM：**

```javascript
// ❌ 错误做法 - 多次触发回流
function badDOMUpdate() {
  const element = document.getElementById("demo");
  element.style.width = "100px"; // 触发回流
  element.style.height = "100px"; // 触发回流
  element.style.margin = "10px"; // 触发回流
}

// ✅ 正确做法 - 批量修改，减少回流
function goodDOMUpdate() {
  const element = document.getElementById("demo");
  element.style.cssText = "width: 100px; height: 100px; margin: 10px;"; // 一次修改
}

// ✅ 更好的做法 - 使用class
function betterDOMUpdate() {
  const element = document.getElementById("demo");
  element.className = "new-style"; // 一次修改
}
```

**使用 display:none 隐藏元素：**

```javascript
// ❌ 错误做法 - 元素仍参与回流重绘
function badHide() {
  const element = document.getElementById("demo");
  element.style.visibility = "hidden"; // 仍参与回流重绘
  element.style.opacity = "0"; // 仍参与回流重绘
}

// ✅ 正确做法 - 元素不参与回流重绘
function goodHide() {
  const element = document.getElementById("demo");
  element.style.display = "none"; // 不参与回流重绘
}
```

## 性能优化建议总结

1. **避免使用 table 布局** - 局部改变会触发整个 table 回流
2. **使用 transform 代替改变位置** - 创建新图层，GPU 加速
3. **批量修改 DOM** - 减少回流次数
4. **使用 display:none 隐藏元素** - 不参与回流重绘
5. **避免频繁查询布局信息** - getBoundingClientRect()会触发回流
6. **使用 CSS3 动画** - transform、opacity 等属性 GPU 加速
7. **合理使用 position** - fixed、absolute 创建新图层
8. **避免在循环中修改样式** - 使用 requestAnimationFrame 优化

## 调试工具

- **Chrome DevTools Performance 面板** - 观察回流重绘
- **Paint flashing** - 高亮重绘区域
- **Layout shifting** - 检测布局偏移
- **Performance Monitor** - 实时监控性能指标

## 这篇博客已完成
