import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    (async () => {
      try {
        // 使用代理，避免跨域
        const res = await fetch("/api/hello");
        const data = await res.json();
        console.log("成功获取数据：", data);
      } catch (err) {
        console.error("请求出错：", err);
      }
    })();

    // JSONP 方式（仅作演示）
    // jsonpRequest();
  }, []);

  // JSONP 请求函数
  const jsonpRequest = () => {
    const script = document.createElement("script");
    script.src = "http://localhost:8080/api/hello?callback=handleResponse";
    document.body.appendChild(script);

    // 定义回调函数
    window.handleResponse = (data) => {
      console.log("JSONP 获取数据：", data);
      document.body.removeChild(script);
      delete window.handleResponse;
    };
  };

  return (
    <>
      <img
        src="https://img1.baidu.com/it/u=2507668054,1972143587&fm=253&fmt=auto&app=120&f=JPEG?w=507&h=500"
        alt=""
      />
    </>
  );
}

export default App;
