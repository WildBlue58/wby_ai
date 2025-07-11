import { useState, useLayoutEffect, useEffect, useRef } from "react";
import "./App.css";

// function App() {
//   // 响应式对象
//   const boxRef = useRef();
//   console.log(boxRef.current, boxRef);

//   useEffect(() => {
//     console.log("useEffect height", boxRef.current.offsetHeight);
//   }, [])

//   useLayoutEffect(() => {
//     console.log("useLayoutEffect height", boxRef.current.offsetHeight);
//   }, [])

//   return (
//     <>
//       <div ref={boxRef} style={{ height: 100 }}></div>
//     </>
//   );
// }

// function App() {
//   const [content, setContent] = useState("");
//   const ref = useRef();

//   // useEffect(() => {
//   //   setContent('曾经有一份真挚的爱情放在我面前，我没有珍惜，等我失去的时候才后悔莫及，人世间最痛苦的事莫过于此。如果上天再给我一次机会，我会对那个女孩说三个字：我爱你。如果非要在这份爱上加一个期限，我希望是——一万年！')
//   //   ref.current.style.height = '200px'
//   // }, [])

//   useLayoutEffect(() => {
//     // 阻塞渲染 同步的感觉
//     setContent(
//       "曾经有一份真挚的爱情放在我面前，我没有珍惜，等我失去的时候才后悔莫及，人世间最痛苦的事莫过于此。如果上天再给我一次机会，我会对那个女孩说三个字：我爱你。如果非要在这份爱上加一个期限，我希望是——一万年！"
//     );
//     ref.current.style.height = "200px";
//   }, []);

//   return (
//     <div ref={ref} style={{ height: "50px", background: "lightblue" }}>
//       {content || "乡乡"}
//     </div>
//   );
// }

// 弹窗
function Modal() {
  const ref = useRef();
  useLayoutEffect(() => {
    const height = ref.current.offsetHeight
    ref.current.style.marginTop = `${(window.innerHeight - height) / 2}px`
  }, [])
  
  return <div ref={ref} style={{background:'lightblue',position:'absolute',height:"200px",width:"200px"}}>我是弹窗</div>
}

function App() { 
  return (
    <>
      <Modal />
    </>
  )
}

export default App;
