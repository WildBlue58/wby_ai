import { client } from "./llm.mjs";

// 向量 cosine函数 文本语义检索
// 你好 hello
// LIKE 文本的检索

const response = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: "你好",
});
console.log(response.data[0].embedding);
