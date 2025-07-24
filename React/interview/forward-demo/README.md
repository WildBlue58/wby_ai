# forwardRef 知识点总结

## 1. 作用

`forwardRef` 是 React 提供的一个高阶组件，用于让函数组件能够接收 `ref` 属性，并将其转发到子组件中的某个 DOM 元素或类组件实例上。默认情况下，函数组件无法接收 `ref`，只能用于类组件或原生 DOM 元素。

## 2. 使用场景

- 需要在父组件中直接操作子组件内部的 DOM 元素（如自动聚焦、获取值等）。
- 封装通用组件时，希望外部能够通过 `ref` 访问内部 DOM。

## 3. 基本用法

```jsx
import React, { forwardRef } from "react";

const MyInput = forwardRef((props, ref) => <input {...props} ref={ref} />);

function Parent() {
  const inputRef = React.useRef();
  React.useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <MyInput ref={inputRef} />;
}
```

## 4. 注意事项

- `forwardRef` 只能用于函数组件，且包裹的组件第一个参数是 `props`，第二个参数是 `ref`。
- 不能直接在函数组件上使用 `ref`，必须用 `forwardRef` 包裹。
- `ref` 最终指向的是你在子组件中绑定的 DOM 元素。

## 5. 结合本项目代码说明

本项目演示了如何用 `forwardRef` 实现父组件直接操作子组件内部的 input 元素：

```jsx
function Guang(props, ref) {
  return (
    <div>
      <input type="text" ref={ref} />
    </div>
  );
}

const WrappedGuang = forwardRef(Guang);

function App() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus(); // 挂载后自动聚焦
  }, []);
  return <WrappedGuang title="Xiang" ref={ref} />;
}
```

- 这里 `Guang` 组件通过 `forwardRef` 包裹后，父组件 `App` 可以通过 `ref` 直接获取到 `input` 元素，实现自动聚焦。
- 如果不使用 `forwardRef`，`ref` 只会指向 `WrappedGuang` 组件实例，而无法获取到内部的 DOM。

## 6. 总结

`forwardRef` 是 React 组件间 ref 传递的桥梁，常用于需要让父组件操作子组件内部 DOM 的场景，是封装高阶组件时的重要工具。
