# WEUI Uploader 组件

一个功能完整的图片上传组件，基于 WEUI 设计规范，支持拖拽上传、图片预览、文件验证等功能。

## 功能特性

### 🎯 核心功能
- ✅ **多文件选择** - 支持一次选择多个图片文件
- ✅ **拖拽上传** - 支持拖拽文件到上传区域
- ✅ **图片预览** - 点击图片可查看大图预览
- ✅ **文件删除** - 支持单独删除已选择的文件
- ✅ **文件验证** - 自动验证文件类型和大小
- ✅ **进度显示** - 显示上传进度和状态
- ✅ **响应式设计** - 适配不同屏幕尺寸

### 🎨 用户体验
- 🎨 **现代化UI** - 基于 WEUI 设计规范
- 🎨 **流畅动画** - 丰富的交互动画效果
- 🎨 **直观操作** - 简单易用的操作界面
- 🎨 **友好提示** - 清晰的操作反馈和错误提示

## 文件结构

```
uploader/
├── index.html          # 主页面文件
├── common.css          # 样式文件
├── uploader.js         # JavaScript 功能实现
└── README.md           # 说明文档
```

## 快速开始

### 1. 基础使用

直接在浏览器中打开 `index.html` 文件即可使用：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WEUI Uploader 组件</title>
    <link rel="stylesheet" href="./common.css">
</head>
<body>
    <!-- 上传器容器 -->
    <div class="weui-uploader" id="uploader">
        <!-- 上传器头部 -->
        <div class="weui-uploader__hd">
            <p class="weui-uploader__title">图片上传</p>
            <div class="weui-uploader__info">
                <span id="uploaded-count">0</span> /
                <span id="max-count">9</span>
            </div>
        </div>
        
        <!-- 上传器主体 -->
        <div class="weui-uploader__bd">
            <ul class="weui-uploader__files" id="file-list"></ul>
            <div class="weui-uploader__input-box" id="upload-btn">
                <input type="file" class="weui-uploader__input" id="file-input" accept="image/*" multiple>
                <div class="weui-uploader__input-text">
                    <span class="weui-uploader__input-icon">+</span>
                    <span class="weui-uploader__input-label">添加图片</span>
                </div>
            </div>
        </div>
    </div>

    <script src="./uploader.js"></script>
</body>
</html>
```

### 2. JavaScript 配置

```javascript
// 创建上传器实例
const uploader = new WeuiUploader({
    maxCount: 9,                    // 最大上传数量
    maxSize: 5 * 1024 * 1024,       // 最大文件大小 (5MB)
    acceptTypes: ['image/*'],       // 接受的文件类型
    autoUpload: false               // 是否自动上传
});
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `maxCount` | Number | 9 | 最大上传文件数量 |
| `maxSize` | Number | 5MB | 单个文件最大大小（字节） |
| `acceptTypes` | Array | ['image/*'] | 接受的文件类型 |
| `autoUpload` | Boolean | false | 是否选择文件后自动上传 |

## API 方法

### 实例方法

#### `getFiles()`
获取所有已选择的文件列表

```javascript
const files = uploader.getFiles();
console.log('已选择的文件:', files);
```

#### `setConfig(config)`
更新组件配置

```javascript
uploader.setConfig({
    maxCount: 5,
    maxSize: 2 * 1024 * 1024 // 2MB
});
```

#### `clearAll()`
清空所有已选择的文件

```javascript
uploader.clearAll();
```

### 事件处理

组件会自动处理以下事件：

- **文件选择** - 点击上传按钮或拖拽文件
- **文件验证** - 自动验证文件类型和大小
- **图片预览** - 点击图片查看大图
- **文件删除** - 点击删除按钮移除文件
- **提交上传** - 点击提交按钮开始上传

## 样式定制

### 自定义主题色

```css
/* 修改主题色 */
.weui-btn_primary {
    background: #your-color;
}

.weui-uploader__file:hover {
    border-color: #your-color;
}
```

### 自定义尺寸

```css
/* 修改图片尺寸 */
.weui-uploader__file,
.weui-uploader__input-box {
    width: 120px;
    height: 120px;
}
```

### 响应式断点

```css
/* 平板设备 */
@media (min-width: 768px) {
    .weui-uploader__file {
        width: 120px;
        height: 120px;
    }
}

/* 桌面设备 */
@media (min-width: 1024px) {
    .weui-uploader__file {
        width: 140px;
        height: 140px;
    }
}
```

## 浏览器兼容性

| 浏览器 | 版本要求 | 支持情况 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 12+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| IE | 11+ | ⚠️ 部分支持 |

## 开发说明

### 技术栈
- **HTML5** - 语义化标签和文件API
- **CSS3** - 现代样式和动画效果
- **ES6+** - 现代JavaScript语法
- **File API** - 文件操作和预览
- **Drag & Drop API** - 拖拽上传功能

### 核心类

#### `WeuiUploader`
主类，负责组件的初始化和功能实现

```javascript
class WeuiUploader {
    constructor(options) {
        // 初始化配置
        this.config = { ...defaultConfig, ...options };
        // 初始化组件
        this.init();
    }
    
    // 文件处理方法
    handleFileSelect(files) { ... }
    validateFile(file) { ... }
    addFile(file) { ... }
    
    // UI更新方法
    updateUI() { ... }
    renderFileItem(fileObj) { ... }
    
    // 事件处理方法
    bindEvents() { ... }
    bindDragEvents() { ... }
}
```

### 扩展开发

#### 添加新的文件类型支持

```javascript
// 在 validateFile 方法中添加新的文件类型验证
validateFile(file) {
    // 支持视频文件
    if (this.config.acceptTypes.includes('video/*')) {
        if (file.type.startsWith('video/')) {
            return true;
        }
    }
    // ... 其他验证逻辑
}
```

#### 自定义上传逻辑

```javascript
// 重写 uploadFile 方法
uploadFile(fileObj) {
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', fileObj.file);
    
    // 发送到服务器
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('上传成功:', data);
    })
    .catch(error => {
        console.error('上传失败:', error);
    });
}
```

## 常见问题

### Q: 如何修改最大上传数量？
A: 在创建实例时设置 `maxCount` 参数：
```javascript
const uploader = new WeuiUploader({ maxCount: 5 });
```

### Q: 如何支持其他文件类型？
A: 修改 `acceptTypes` 配置：
```javascript
const uploader = new WeuiUploader({
    acceptTypes: ['image/*', 'video/*', 'application/pdf']
});
```

### Q: 如何自定义上传接口？
A: 重写 `uploadFile` 方法或修改 `handleSubmit` 方法中的上传逻辑。

### Q: 如何获取上传的文件数据？
A: 使用 `getFiles()` 方法：
```javascript
const files = uploader.getFiles();
files.forEach(file => {
    console.log('文件名:', file.name);
    console.log('文件大小:', file.size);
    console.log('文件类型:', file.type);
});
```

## 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本发布
- ✨ 支持多文件选择和拖拽上传
- ✨ 支持图片预览和删除功能
- ✨ 支持文件类型和大小验证
- ✨ 响应式设计和现代化UI

## 许可证

MIT License - 可自由使用和修改

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件！

---

**注意**: 这是一个前端演示组件，实际使用时需要配合后端接口来实现真正的文件上传功能。