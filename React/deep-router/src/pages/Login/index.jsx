import { useNavigate, useLocation } from "react-router-dom"; // Navigate 组件 JS 跳转
import { useState } from "react";
const Login = () => {
  const location = useLocation();
  //   console.log(location.state.from);
  const navigate = useNavigate();// navigate 能力

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      localStorage.setItem("isLogin", "true");
      navigate(location?.state?.from || "/");
    } else {
      alert("用户名或密码错误");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>登录页面</h1>
      <input
        type="text"
        placeholder="用户名"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="密码"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">登录</button>
    </form>
  );
};
export default Login;
