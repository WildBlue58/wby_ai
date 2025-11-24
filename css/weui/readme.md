# 微信当家框架 WEUI

## 简介

WEUI 是微信官方设计团队为微信 Web 开发量身打造的基础样式库，遵循 BEM 国际命名规范，提供了一套完整的组件化开发方案。

## BEM 命名规范

BEM（Block Element Modifier）是一种前端 CSS 命名方法论，通过统一的命名规范，让代码更易维护、更易协作。

### Block（块）

**概念**：独立的、可复用的页面组件，代表一块具有特定功能的内容区域。

**命名规则**：

- 格式：`项目代号 + 区块作用/职责`
- 示例：
  - `.weui-page` - 页面容器
  - `.weui-btn` - 按钮组件
  - `.tm-page` - 其他项目的页面容器

**特点**：

- 可复用的代码块
- 具有统一的风格和项目代号
- 在 UI 框架中，button、input、cell 等通用组件都作为独立的 Block

### Element（元素）

**概念**：Block 内部的组成部分，不能独立存在，必须属于某个 Block。

**命名规则**：

- 格式：`.weui-{block}__{element}`
- 使用双下划线 `__` 连接 Block 和 Element
- 同一 Block 内的 Element 概念不重叠

**示例**：

- `.weui-page__title` - 页面标题
- `.weui-page__desc` - 页面描述
- `.weui-btn__icon` - 按钮图标

### Modifier（修饰符）

**概念**：用于描述 Block 或 Element 的状态、外观或行为变体。

**命名规则**：

- 格式：`.weui-{block}_{modifier}` 或 `.weui-{block}__{element}_{modifier}`
- 使用单下划线 `_` 连接

**示例**：

- `.weui-btn_primary` - 主要按钮
- `.weui-btn_default` - 默认按钮
- `.weui-btn_warn` - 警告按钮
- `.weui-btn_disabled` - 禁用状态
- `.weui-btn_loading` - 加载状态
- `.weui-btn_plain` - 朴素样式
- `.weui-btn_plain_primary` - 朴素样式的主要按钮

## BEM 规范的优势

1. **组件式开发**：通过多个 Block 组合，快速构建完整页面
2. **代码复用**：基础架构代码可在不同项目中复用
3. **团队协作**：统一的命名规范，便于大厂团队协作开发
4. **易于维护**：清晰的命名结构，降低代码维护成本

## 命名规范总结

```text
页面由 blocks 构成：     .weui-{block}
block 包含 elements：    .weui-{block}__{element}
element 有状态修饰：     .weui-{block}__{element}_{modifier}
```

## 学习建议

- 学习 WEUI 源码，理解基础架构代码的设计思路
- 在实际项目中应用 BEM 规范，提升代码质量
- 参考 WEUI 的组件设计，构建自己的组件库
