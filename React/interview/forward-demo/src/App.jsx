import {
  useRef,
  useEffect,
  forwardRef,
} from "react";
import "./App.css";

function Guang(props,ref) {
  console.log(props,ref);
  return (
    <div>
      <input type="text" ref={ref} />
    </div>
  );
}

// 高阶组件 返回一个全新的组件，ref 向下传递的能力
const WrappedGuang = forwardRef(Guang);

function App() {
  // 父组件 ref
  const ref = useRef(null);
  console.log(ref.current);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <>
      <div className='App'>
        {/* <input ref={ref} /> */}
        {/* <Guang title="Xiang" ref={ref} /> */}
        <WrappedGuang title="Xiang" ref={ref} />
      </div>
    </>
  );
}

export default App;
