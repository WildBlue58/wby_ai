import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { type Repo } from "@/app/types/repo";

export default async function ReposPage() {
  // 在服务器端获取数据，使用绝对URL
  const result = await fetch("http://localhost:3000/api/repos", {
    // 在开发环境中禁用缓存
    cache: "no-store",
  });
  const repos: Repo[] = await result.json();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Github Repos</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <CardDescription>{repo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Language: {repo.language || "Not specified"}
              </p>
              <p className="text-sm text-gray-600">
                Stars: {repo.stargazers_count}
              </p>
            </CardContent>
            <CardFooter>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View on GitHub
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
