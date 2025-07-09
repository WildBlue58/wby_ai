# HTML5 王者对象 Blob

- 图片转成base64字符串编码
- atob(base64) 二进制的字符串编码
- for 每一个字符
  charCodeAt() 0-255 byte的整数
  Uint8Array()
- 二进制文件对象描述 new Blob([uint8Array],类型)
- 二进制层面上压缩，切割，修改
浏览器将会为二进制提供一个临时访问的地址
- URL.createObjectURL(blob) 创建一个临时的URL对象

Blob（Binary Large Object，二进制大对象）是 HTML5 中用于处理二进制数据的对象。它可以用来表示不可变的原始数据，比如图片、音频、视频、文件等。Blob 允许你在前端以二进制的方式操作数据，比如切割、合并、压缩等。
简单来说，Blob 就像一个“二进制文件容器”，你可以把任意二进制数据放进去，然后用 JavaScript 进行处理。常见的用法有：
将图片、音频、视频等文件转成 Blob 对象，方便前端处理或上传。
用 new Blob([数据], {type: '类型'}) 创建一个 Blob 对象。
用 URL.createObjectURL(blob) 为 Blob 创建一个临时的访问 URL，可以直接在页面上预览或下载。
可以通过 FileReader、fetch、XMLHttpRequest 等 API 读取或传输 Blob 数据。

Blob 的主要作用就是让前端可以像操作文件一样操作二进制数据，非常适合做文件上传、下载、预览、图片处理等场景。

## 这篇博客已完成
