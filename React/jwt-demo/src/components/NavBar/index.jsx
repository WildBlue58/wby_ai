import { Link } from "react-router-dom";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { isLogin, user, logout } = useUserStore();
  console.log(isLogin, user, "/////");
  const navigate = useNavigate();
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>&nbsp;&nbsp;
      <Link to="/pay">Pay</Link>&nbsp;&nbsp;
      {isLogin ? (
        <>
          <span>Welcome, {user.username}</span>&nbsp;&nbsp;
          <button onClick={logout}> Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
