const fs = require("fs"); // fs 帮助我们读取文件
const path = require("path");
const { OpenAI } = require("openai");
// 优先加载同目录 .env
require("dotenv").config({ path: path.join(__dirname, ".env") });
// 如同目录未生效，尝试上级目录（便于从仓库根目录运行）
if (!process.env.OPENAI_API_KEY && !process.env.API_KEY) {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

// 模型 ollama
// 给它喂私有知识库，不怕私有被外界大模型训练了
// 安全
// 兼容多种常见变量名，按优先级取第一个可用的
const resolvedApiKey =
  process.env.OPENAI_API_KEY ||
  process.env.API_KEY ||
  process.env.OPENAI_TOKEN ||
  process.env.OPENAI_SECRET;

if (!resolvedApiKey) {
  console.error(
    "未发现可用的 API Key。请在 .env 中设置 OPENAI_API_KEY=你的密钥（或 API_KEY）。"
  );
  console.error(
    "已尝试路径：rag/demo/.env 与 rag/.env；也可用 PowerShell 临时设置 $env:OPENAI_API_KEY 再运行。"
  );
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: resolvedApiKey,
  baseURL: process.env.OPENAI_BASE_URL,
});

const testQuestion = "有多少们课程？";

function readCourseInfo() {
  try {
    const filePath = path.join(__dirname, "lesson.txt");
    console.log(filePath);
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error("读取课程信息文件失败:", error);
    return "";
  }
}

async function answerQuestion(question) {
  // 检索
  const courseInfo = readCourseInfo();
  console.log(courseInfo);
  if (!courseInfo) {
    return "无法读取课程信息，请确保lesson.txt文件存在且有内容";
  }
  try {
    const prompt = `
            你是一个课程助手，请根据以下课程信息回答问题。
            只回答与课程信息相关的内容。如果内容与课程无关，
            请礼貌地说明你只能回答与课程相关的问题。

            课程信息：
            ${courseInfo}

            问题：${question}
        `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业的课程助手，请根据课程信息回答问题。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error("调用OpenAI API 失败：", err);
    return "抱歉，处理您的问题时出现错误";
  }
}

answerQuestion(testQuestion).then((answer) => {
  console.log("问题：", testQuestion);
  console.log("回答：", answer);
});
