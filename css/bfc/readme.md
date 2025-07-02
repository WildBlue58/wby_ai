# BFC

- 在弹性布局之前，我们一般用float 做两列式、三列式或多列式布局。
  - 业务场景
  - float 让元素向左浮动，向右浮动 两列
  - 都向左浮动 多列
  - 浮动元素会离开文档流，但和定位离开文档流不一样 不彻底
    文字围绕它浮动
  - 外层盒子里 overflow: hidden;
    触发生成一个BFC Block Formatting Context
    块级格式化上下文
    .container 原来是一个block 块级盒子
    升级为BFC 盒子 不再是普通的盒子
    FC Formatting Context
    flex 子元素会在一起
    全新的渲染区域，不受外界影响
    FFC Flex
- HTML 是最外层，第一个BFC 盒子
  - 块级元素是从上到下排列
  - 行内元素是从左到右排列
- BFC元素可以拿到浮动元素的高度
  计算BFC的高度时，浮动元素也参与计算

- 示例1（1.html）：
  - .container 没有触发BFC，仅设置了宽度。
  - .box 使用 float:left 浮动，margin 较大。
  - 浮动元素脱离普通文档流，后面的文字会环绕浮动元素，容器高度不会包含浮动元素，导致容器高度塌陷。
  - 现象：蓝色方块浮动，后面的文字环绕在其右侧和下方，container 没有包裹浮动元素高度。

- 示例2（2.html）：
  - .container 设置 overflow: hidden; 触发BFC。
  - .box 同样 float:left。
  - 由于 container 变为BFC，浮动元素的高度会被包含在 container 内，容器高度不再塌陷。
  - 现象：蓝色方块浮动，container 能完整包裹所有浮动元素。

- 总结：
  - 触发BFC的常用方式有：overflow: hidden;、position: absolute/fixed;、display: flex/grid/inline-block; 等。
  - BFC 可以解决浮动元素导致的高度塌陷问题，使容器能够包含浮动子元素。
  - BFC 也是实现多列布局、清除浮动等常见布局技巧的基础。

## 这篇博客已完成
