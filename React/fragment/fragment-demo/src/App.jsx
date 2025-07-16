import {
  useState,
  Fragment, // 文档碎片组件
} from "react";
import "./App.css";
import { useEffect } from "react";

// function Demo() {
//   return (
//     // DOM 树 多了一层不需要的节点，DOM 解析性能下降，多迭代一层
//     <>
//       <Fragment>
//         <h1>Love Xiang</h1>
//         <p>Beautiful Girl</p>
//       </Fragment>
//     </>
//   )
// }

function Demo({ items }) {
  // 解构获取 items
  return items.map((item) => (
    <Fragment key={item.id}>
      <h1>{item.name}</h1>
      <p>{item.content}</p>
    </Fragment>
  ));
}

function App() {
  const items = [
    { id: 1, name: "Love Xiang", content: "Beautiful Girl" },
    { id: 2, name: "Beautiful Girl", content: "Love Xiang" },
  ];
  return <Demo items={items} />;
}

export default App;
