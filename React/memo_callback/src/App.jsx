import {
  useState,
  useEffect,
  useCallback,
  useMemo, // 缓存一个复杂计算的值
} from "react";
import "./App.css";
import Button from "./components/Button";

function App() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);
  console.log("App render");

  // 先定义函数 复杂计算 开销高
  const expensiveComputation = (n) => {
    console.log("expensiveComputation");
    for (let i = 0; i < 1000000; i++) {
      i++;
    }
    return n * 2;
  };

  // 再用 useMemo 缓存计算结果
  const result = useMemo(() => {
    return expensiveComputation(num);
  }, [num]);

  useEffect(() => {
    console.log("count", count);
  }, [count]);
  useEffect(() => {
    console.log("num", num);
  }, [num]);
  // rerender 重新生成
  // 不要重新生成，和 useEffect [] 一样
  //  callback 回调函数 缓存
  const handleClick = useCallback(() => {
    console.log("handleClick");
  }, [num]);

  return (
    <>
      <div>{result}</div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <br />
      <button onClick={() => setNum(num + 1)}>+</button>
      <br />
      <Button num={num} onClick={handleClick}>
        Love Xiang
      </Button>
    </>
  );
}

export default App;
