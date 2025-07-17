import { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";
// import { getRepos, getRepoDetail } from "./api/repos";
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Loading from "./components/Loading";

const RepoList = lazy(() => import("./pages/RepoList"));

function App() {
  // const [repos, setRepos] = useState([]);
  // useEffect(() => {
  //   (async () => {
  //     const res = await getRepos("WildBlue58");
  //     setRepos(res.data);
  //     console.log(res);
  //   })();
  // }, []);
  // useEffect(() => {
  //   (async () => {
  //     const repos = await getRepos("WildBlue58");
  //     const repo = await getRepoDetail("WildBlue58", "wby_ai");
  //     console.log(repos, repo);
  //   })();
  // }, []);
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/users/:id/repos" element={<RepoList />} />
          <Route path="*" element={<Navigate to="/users/WildBlue58/repos" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
