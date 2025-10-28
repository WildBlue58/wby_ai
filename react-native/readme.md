# react native 开发

- npm i -g expo-cli

## RN

来自FaceBook 的移动端开发框架

- React SPA、SSR Web 网页应用 是前端 80% 工作主流
  http url 访问
- IOS/Android 开发的移动端应用
  应用市场
  - IOS/Android 开发，一个应用要搞两拨人
    - Java\Kotlin
    - Swift\Objective-C
  开发成本极高
- RN 跨平台开发，一套代码 可以同时在IOS/Android 上运行
  性能很好
  JS Bridge React 写的代码 调用手机上的设备
  VDOM
- expo 是让RN开发更丝滑的工具
  - expo go 扫码安装应用
  - 手机上查看效果，react 开发

## RN UI 组件库

### 思路

- 用熟悉的React 组件写法调用手机原生组件
- CSS RN 提供了StyleSheet 样式表
- 不是HTML5，没有LocalStorage，但是有AsyncStorage异步存储
