# React Fiber 机制

- 组件比较多，组件树(树状组件)的深度比较深
  每个组件都需要经历 JSX模板的编译、VDOM 的创建、响应式的声明、
  生命周期、挂载等

  怎么办？核心问题是什么？
  react 组件渲染是同步代码，更加重要的没机会做
  打断一下，让浏览器响应用户更优先的先做一下，到时候再回来接着执行。

- fiber 机制是 react 16引入的重写核心算法，实现了可中断渲染。
  -学习过什么 api 类似fiber
  可打断可持续
  requestAnimationFrame
  requestIdleCallback