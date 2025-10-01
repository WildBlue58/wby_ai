# 机器学习

- notebookllm
  你不知道的Javascript 深入学习
  AI 播客

- modelscope
  阿里开源大模型社区
  ipynb 后缀
  nlp 机器学习文档格式

- python
  nlp 第一语言
  js 也挺好

- 引入了pipeline 模块
  model中国第一大模型社区
  魔搭
  from modelscope.pipelines import pipeline  // 导入 modelscope 的 pipeline 模块，用于创建处理管道

  from modelscope.utils.constant import Tasks  // 导入 modelscope 的 Tasks 常量，用于定义任务类型
  
  semantic_cls = pipeline(Tasks.text_classification,'damo/nlp_structbert_sentiment-classification_chinese-base')  // 创建一个文本分类的管道，使用指定的中文情感分类模型
  打分 label分类
  result = semantic_cls(input='周杰伦真的富有才华')

## 补充学习资料

### 实践示例扩展

```python
# 更多情感分析示例
texts = [
    '这部电影真的很棒！',
    '服务态度太差了',
    '产品质量一般般',
    '强烈推荐这家店！'
]

for text in texts:
    result = semantic_cls(input=text)
    print(f"文本: {text}")
    print(f"结果: {result}")
    print("---")
```

### 其他 NLP 任务

- **文本分类**: 新闻分类、垃圾邮件检测
- **命名实体识别**: 人名、地名、机构名识别
- **文本摘要**: 自动生成文本摘要
- **机器翻译**: 多语言翻译任务

### 进阶学习方向

1. **深度学习框架**
   - PyTorch
   - TensorFlow
   - PaddlePaddle

2. **预训练模型**
   - BERT 系列
   - GPT 系列
   - T5 模型

3. **实际应用场景**
   - 智能客服
   - 内容审核
   - 舆情分析
   - 推荐系统

### 学习资源链接

- [ModelScope 官网](https://modelscope.cn/)
- [Hugging Face](https://huggingface.co/)
- [中文 NLP 资源](https://github.com/crownpku/Awesome-Chinese-NLP)
