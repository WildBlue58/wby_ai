import { useState, useEffect } from "react";
import "./App.css";
import { getRepos } from "./api/repos";

function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRepos("WildBlue58");
        setRepos(res.data);
        console.log(res.data); // 这里可以看到返回的数据
      } catch (err) {
        setError("获取仓库失败");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>WildBlue58 的 GitHub 仓库</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <p>{repo.description}</p>
            <span>⭐ {repo.stargazers_count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
