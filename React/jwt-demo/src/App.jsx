import { useState, useEffect, lazy, Suspense } from "react";
import { getUser } from "./api/user";
import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";

const Home = lazy(() => import("./views/Home"));
const Pay = lazy(() => import("./views/Pay"));
const Login = lazy(() => import("./views/Login"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));

function App() {
  useEffect(() => {
    (async () => {
      const res = await getUser();
      console.log(res, "----res");
    })();
  }, []);

  return (
    <>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pay" element={
            <RequireAuth>
              <Pay />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
