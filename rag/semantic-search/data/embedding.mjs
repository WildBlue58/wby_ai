// 负责 posts.json的模块化
// 支持了fs的promise 版本
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// readFileSync 同步
// readFile() 异步 callback
// fs 推出了promise 版本
import { client } from "../llm.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFilePath = join(__dirname, "posts.json");
const outputFilePath = join(__dirname, "posts_with_embedding.json");
// 最流行写法
const data = await fs.readFile(inputFilePath, "utf-8");
console.log(data);
// 向量化
const posts = JSON.parse(data);
const postsWithEmbedding = [];

for (const { title, category } of posts) {
  // console.log(title, category, '--------');
  const response = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: `标题: ${title}; 分类: ${category}`,
  });

  postsWithEmbedding.push({
    title,
    category,
    embeddings: response.data[0].embedding,
  });
}

await fs.writeFile(outputFilePath, JSON.stringify(postsWithEmbedding, null, 2));
