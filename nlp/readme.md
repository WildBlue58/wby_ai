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