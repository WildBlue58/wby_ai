import { useReposStore } from "../../store/repos";
import { useEffect } from "react";

const RepoList = () => {
    const { repos, loading, error, fetchRepos } = useReposStore();
    useEffect(() => {
        fetchRepos("WildBlue58");
    }, []);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div>
            <h1>Repo List</h1>
            <ul>
                {repos.map((repo) => (
                    <li key={repo.id}>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.name}
                        </a>
                        <p>{repo.description || "No description"}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RepoList;