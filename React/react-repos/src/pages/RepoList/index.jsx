import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useRepos } from "@/hooks/useRepos";

const RepoList = () => {
  const { id } = useParams();
  console.log(useParams());
  const navigate = useNavigate();
  // hooks
  const { repos, loading, error } = useRepos(id);
  console.log(repos, loading, error);
  useEffect(() => {
    if (!id.trim()) {
      navigate("/");
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2>Repositories for {id}</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <Link to={`/users/${id}/repos/${repo.id}`}>{repo.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RepoList;
