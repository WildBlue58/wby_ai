import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import KeepAlive from "./KeepAlive";
import Home from "./pages/Home";
import About from "./pages/About";

function RouterWithKeepAlive() {
  const location = useLocation();

  return (
    <div>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> |<Link to="/about">About</Link>
      </nav>
      <KeepAlive active={location.pathname === "/"}>
        <Home />
      </KeepAlive>
      {location.pathname === "/about" && <About />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RouterWithKeepAlive />} />
      <Route path="/about" element={<RouterWithKeepAlive />} />
    </Routes>
  );
}
