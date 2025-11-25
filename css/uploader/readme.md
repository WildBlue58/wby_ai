# uploader 大厂必考

- 源码学习是核心
  - 高质量的代码和技巧
  - 思维方式
- 技能点
  - 语义化标签
  - BEM 命名规范
  - 弹性布局
  - stylus 变量，模块化
  - 伪元素
- weui-uploader 源码
  - weui-uploader 外面严谨的套上了 .weui-cells
  - .weui-cells 移动端收集用户数据或操作表单表格
    - .weui-cell 每个表单元素
      - .weui-cell__bd 表单元素内容
- -webkit-overflow-scrolling touch 移动端滚动优化
  滚动更敏感,感知touch
  -webkit 实验阶段
    chrome 浏览器内核的代号 使用起来
    移动端没有微软 苹果，安卓都是(webkit)
- 变量组成了weui 主题风格
- stylus & 应用上一层 伪类，伪状态
- float 布局
  - 早于flex 的布局方案
  - 浮动脱离文档流
  - float:left,float:right 左浮 右浮 两列式布局
  - 一直float:left 多列
  - 一行不够，自动换行
  
## 文件上传核心知识点

### input[type="file"] 基础

- `accept` 属性限制文件类型
  - `accept="image/*"` 只接受图片
  - `accept=".jpg,.png,.gif"` 指定扩展名
  - `accept="image/jpeg,image/png"` 指定 MIME 类型
- `multiple` 属性支持多文件选择
- `capture` 属性调用摄像头（移动端）
  - `capture="user"` 前置摄像头
  - `capture="environment"` 后置摄像头

### FileReader API

- `readAsDataURL()` 读取为 base64，用于图片预览
- `readAsArrayBuffer()` 读取为二进制，用于分片上传
- `readAsText()` 读取文本内容
- `onload` / `onerror` / `onprogress` 事件监听

### 图片预览实现

```javascript
// 方式一：FileReader
const reader = new FileReader()
reader.onload = (e) => img.src = e.target.result
reader.readAsDataURL(file)

// 方式二：URL.createObjectURL（推荐，性能更好）
img.src = URL.createObjectURL(file)
// 使用完毕记得释放：URL.revokeObjectURL(url)
```

### 上传进度监控

- XMLHttpRequest 的 `upload.onprogress` 事件
- `event.loaded` / `event.total` 计算百分比
- Fetch API 需要借助 ReadableStream 实现

### 拖拽上传

- `dragenter` / `dragover` / `dragleave` / `drop` 事件
- 阻止默认行为 `e.preventDefault()`
- `e.dataTransfer.files` 获取拖入的文件

## 大文件上传（面试高频）

### 分片上传原理

- `Blob.slice(start, end)` 切割文件
- 并发上传多个分片
- 服务端按顺序合并分片

### 断点续传

- 前端：localStorage 记录已上传分片
- 后端：返回已上传分片列表
- 秒传：文件 hash 比对（spark-md5 计算）

### Web Worker 计算 hash

- 大文件 hash 计算会阻塞主线程
- 使用 Worker 在后台线程计算
- `postMessage` 通信传递进度和结果

## 面试常见问题

1. **如何实现图片压缩上传？**
   - Canvas 重绘 + `toDataURL()` / `toBlob()`
   - 控制输出质量参数

2. **如何限制上传文件大小？**
   - `file.size` 获取字节数
   - 前端校验 + 后端校验双重保障

3. **上传失败如何处理？**
   - 重试机制（指数退避）
   - 分片上传失败只重传失败分片

4. **如何防止重复上传？**
   - 文件 hash 作为唯一标识
   - 服务端校验实现秒传

## 这篇博客已完成
