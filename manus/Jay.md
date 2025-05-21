# 网站生成需求

## 网站主题
- 主题：周杰伦的专辑与歌曲展示
- 标识：WildBlue

## 网站内容
1. **专辑展示**
   - 每张专辑的封面图片
   - 专辑名称
   - 发行日期
   - 专辑简介

2. **歌曲展示**
   - 每首歌曲的名称
   - 歌曲时长
   - 歌曲试听链接（如果有）
   - 歌词展示（可选）

## 网站样式
- **整体风格**：现代、简洁、音乐主题
- **颜色搭配**：以蓝色为主色调，搭配白色和灰色
- **字体**：使用易读的现代字体，标题字体稍大，正文字体适中
- **布局**：响应式设计，适配不同设备（PC、平板、手机）
- **交互效果**：鼠标悬停效果、平滑滚动、动态加载

## 其他要求
- 在网站底部添加版权信息：“© 2025 WildBlue. All rights reserved.”
- 添加社交媒体链接（如果有）
- 确保网站加载速度快，优化图片和资源

## 示例结构
```html
<header>
    <h1>周杰伦专辑与歌曲展示</h1>
    <p>标识：WildBlue</p>
</header>
<main>
    <section id="albums">
        <h2>专辑列表</h2>
        <div class="album">
            <img src="album_cover.jpg" alt="专辑封面">
            <h3>专辑名称</h3>
            <p>发行日期：YYYY-MM-DD</p>
            <p>专辑简介：...</p>
        </div>
        <!-- 更多专辑 -->
    </section>
    <section id="songs">
        <h2>歌曲列表</h2>
        <div class="song">
            <h3>歌曲名称</h3>
            <p>时长：MM:SS</p>
            <p>试听链接：<a href="#">点击试听</a></p>
            <p>歌词：...</p>
        </div>
        <!-- 更多歌曲 -->
    </section>
</main>
<footer>
    <p>© 2024 WildBlue. All rights reserved.</p>
</footer>