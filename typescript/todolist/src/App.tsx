// 组件的类型约束
import "./App.css";
import HelloComponent from "./components/HelloComponent.tsx";

// react + typescript
// javascript 可能会有些问题，主要因为弱类型
// jsx 后缀改成 tsx
// 函数进行类型约束

// const HelloComponent = () => {
//   // void 空 ReactNode
//   return 1
// }

function App() {
  // 编译阶段
  // 多写了些类型申明文件
  // 多写一些代码 类型申明 代码质量保驾护航
  let count:number = 10;
  const title: string = "Hello ts";
  const isDone: boolean = true;
  const list: number[] = [1, 2, 3];
  // 元组类型
  const tuple: [number, string] = [1, "乡乡"]; 
  // 枚举类型 - 使用 const enum 或对象字面量
  const Status = {
    Pending: 0,
    Fulfilled: 1,
    Rejected: 2
  } as const;
  const pStatus = Status.Pending;
  // 对象的约束
  // 接口
  interface User{
    name: string;
    age: number;
    isSingle?:boolean;
  }
  // 使用 interface 来约定类型
  const user:User = {
    name: "乡乡",
    age: 18,
    isSingle:false,
  }
  return (
    <>
      {count}
      {title}
      {user.name} {user.age}
      {/* typescript 很严格 */}
      <HelloComponent name="乡乡"/>
    </>
  )
}

export default App
