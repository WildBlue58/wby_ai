# 智能前端之图片识别

- StrictMode react 默认启动的严格模式
  执行一次 测试一次 两次
- 良好的编程风格
  移除不需要的代码
- import.meta.env.VITE_API_KEY 获取环境变量对象
  代码运行时可以和环境变量交互
  把env 写到代码里
- async await 异步编程
  then
  异步
  流程控制
  await 比 then 更同步化 简单
- class 是 JS 关键字
  - React JSX 运行，以原生JS 来运行
  className 代替 class
- 无障碍访问
  label htmlFor + input#id
  - 本地预览 preview
    - 良好且必须的用户体验，实时的告知用户在发生什么
    - 图片上传及处理挺慢的，所以需要preview
    - onChange
    e.target.files[0] 拿到图片对象
    FileReader 实例
    readAsDataURL 读取文件方法
      - data? base64 数据
      - base64 直接作为img src

- 静态的html -> 动态模板({data}) -> 状态 State useState
