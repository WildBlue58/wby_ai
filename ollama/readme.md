# Ollama

Ollama 是一个让你通过简单命令在本地轻松下载、运行和管理大语言模型的工具，支持GPU加速和类OpenAI接口，适合本地部署和开发。

## 主要特性

- 🚀 **简单易用**：通过命令行轻松管理AI模型
- 🖥️ **本地部署**：完全本地运行，保护数据隐私
- ⚡ **GPU加速**：支持NVIDIA GPU加速推理
- 🔌 **API兼容**：提供类似OpenAI的API接口
- 📦 **模型管理**：自动下载、更新和管理模型

## 支持的模型

### Meta Llama 系列

- `llama3.2` - 最新版本Llama模型
- `llama3.1` - 稳定版本
- `llama3` - 经典版本

### DeepSeek 系列

- `deepseek-r1:1.5b` - 1.5B参数的推理模型
- `deepseek-coder` - 代码生成专用模型

### Qwen 系列

- `qwen2.5` - 阿里巴巴开源模型
- `qwen2.5-coder` - 代码专用版本

## 安装和使用

### 安装 Ollama

```bash
# 访问官网下载安装包
https://ollama.ai/download
```

### 基本命令

```bash
# 拉取模型
ollama pull llama3.2

# 运行模型（交互式）
ollama run llama3.2

# 运行模型（一次性对话）
ollama run llama3.2 "你好，请介绍一下自己"
```

## API 服务

Ollama 在 `11434` 端口提供 REST API 服务：

### 启动服务

```bash
ollama serve
```

### API 调用示例

```bash
# 生成文本
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "你好，请介绍一下自己",
  "stream": false
}'

# 聊天对话
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}'
```

## 常用配置

### 环境变量

```bash
# 设置模型存储路径
export OLLAMA_MODELS=~/models

# 设置API端口（默认11434）
export OLLAMA_HOST=0.0.0.0:11434
```

### 配置文件

配置文件位置：`~/.ollama/models/manifests/registry.ollama.ai/`

## 性能优化

### GPU 加速

```bash
# 检查GPU支持
ollama list

# 使用特定GPU
CUDA_VISIBLE_DEVICES=0 ollama run llama3.2
```

### 内存管理

```bash
# 查看模型信息
ollama show llama3.2

# 卸载模型释放内存
ollama rm llama3.2
```

## 开发集成

### Python 客户端

```python
import requests

response = requests.post('http://localhost:11434/api/generate',
                        json={
                            'model': 'llama3.2',
                            'prompt': '你好',
                            'stream': False
                        })
print(response.json()['response'])
```

### JavaScript 客户端

```javascript
const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        model: 'llama3.2',
        prompt: '你好',
        stream: false
    })
});
const data = await response.json();
console.log(data.response);
```

## 故障排除

### 常见问题

1. **端口被占用**：修改 `OLLAMA_HOST` 环境变量
2. **内存不足**：选择更小的模型或增加虚拟内存
3. **GPU不支持**：检查CUDA版本和驱动

### 日志查看

```bash
# 查看服务日志
ollama serve --verbose

# 查看模型日志
ollama logs <model_name>
```

## 相关链接

- [官方文档](https://ollama.ai/docs)
- [GitHub仓库](https://github.com/ollama/ollama)
- [模型库](https://ollama.ai/library)
- [社区论坛](https://github.com/ollama/ollama/discussions)

## 许可证

Ollama 采用 MIT 许可证，详见 [LICENSE](https://github.com/ollama/ollama/blob/main/LICENSE) 文件。
