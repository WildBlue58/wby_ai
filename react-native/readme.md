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

## 快速开始

### 创建项目

```bash
# 使用 Expo CLI
npx create-expo-app MyApp

# 或使用 React Native CLI
npx react-native init MyApp
```

### 运行项目

```bash
# Expo 项目
npm start
# 或
expo start

# React Native CLI 项目
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## RN UI 组件库

### 思路

- 用熟悉的React 组件写法调用手机原生组件
- CSS RN 提供了StyleSheet 样式表
- 不是HTML5，没有LocalStorage，但是有AsyncStorage异步存储

### 核心组件

- **View**: 类似 div，最基础的容器组件
- **Text**: 文本组件，所有文字必须包裹在 Text 中
- **Image**: 图片组件，支持本地和网络图片
- **ScrollView**: 可滚动视图
- **FlatList**: 高性能列表组件（推荐用于长列表）
- **TextInput**: 文本输入框
- **Button**: 按钮组件
- **TouchableOpacity/TouchableHighlight**: 可点击组件
- **SafeAreaView**: 安全区域视图（适配刘海屏）

### 样式系统

- **StyleSheet.create()**: 创建样式表，性能优化
- **Flexbox**: 默认布局方式，类似 Web 的 Flexbox
- **单位**: 使用数字，默认单位是 dp（密度无关像素）
- **不支持**:
  - 百分比宽度（需用 Dimensions API）
  - 部分 CSS 属性（如 position: fixed）
  - 伪类选择器

```javascript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
```

## 导航

### React Navigation

RN 官方推荐的导航库

```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

- **Stack Navigator**: 堆栈导航（页面跳转）
- **Tab Navigator**: 底部标签导航
- **Drawer Navigator**: 侧边栏导航

## 状态管理

- **useState/useReducer**: React Hooks，适合组件级状态
- **Context API**: 跨组件状态共享
- **Redux**: 复杂应用的状态管理
- **Zustand/MobX**: 轻量级状态管理方案

## 数据存储

- **AsyncStorage**: 异步键值存储（类似 localStorage）
- **SQLite**: 关系型数据库
- **Realm**: 移动端数据库
- **MMKV**: 高性能键值存储

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 存储
await AsyncStorage.setItem('key', 'value');

// 读取
const value = await AsyncStorage.getItem('key');
```

## 网络请求

- **fetch API**: 内置的 Web API
- **axios**: 流行的 HTTP 客户端
- **react-query/swr**: 数据获取和缓存库

## 常用库推荐

- **@react-navigation/native**: 导航
- **react-native-vector-icons**: 图标库
- **react-native-gesture-handler**: 手势处理
- **react-native-reanimated**: 高性能动画
- **react-native-fast-image**: 优化的图片组件
- **react-hook-form**: 表单处理
- **date-fns/dayjs**: 日期处理

## 开发工具

- **React Native Debugger**: 独立的调试工具
- **Flipper**: Facebook 的调试平台
- **React DevTools**: React 组件调试
- **Metro Bundler**: RN 的打包工具（类似 Webpack）

## 调试技巧

- **console.log**: 基础调试
- **React DevTools**: 组件树查看
- **Chrome DevTools**: 网络请求、性能分析
- **远程调试**: 在 Chrome 中调试 JS 代码
- **错误边界**: ErrorBoundary 捕获错误

## 性能优化

- **FlatList vs ScrollView**: 长列表使用 FlatList
- **useMemo/useCallback**: 避免不必要的重新渲染
- **React.memo**: 组件缓存
- **图片优化**: 压缩图片，使用合适尺寸
- **避免内联样式**: 使用 StyleSheet.create
- **懒加载**: 按需加载组件和资源

## 打包发布

### Expo 项目

```bash
# 构建
eas build --platform android
eas build --platform ios

# 提交到应用商店
eas submit --platform android
eas submit --platform ios
```

### React Native CLI 项目

- **Android**: 生成 APK/AAB 文件
- **iOS**: 使用 Xcode 打包并提交到 App Store

## 与 Web 开发的区别

| Web | React Native |
|-----|--------------|
| HTML 标签 | RN 组件（View, Text） |
| CSS | StyleSheet |
| localStorage | AsyncStorage |
| window/document | 不支持 |
| 事件处理 | 使用 RN 的触摸事件 |
| 路由 | React Navigation |
| 响应式单位 | 使用数字（dp） |

## 注意事项

- 所有文本必须包裹在 `<Text>` 组件中
- 样式不支持所有 CSS 属性
- 图片需要明确指定宽高或使用 flex
- 网络图片需要 https（iOS 要求）
- 使用 Platform.OS 区分平台代码
- 测试时注意真机测试，模拟器可能表现不同
