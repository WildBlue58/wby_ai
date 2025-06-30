# colab

- 魔搭 = colab(在线nlp实验室) + huggingface(大模型社区，发布)
- .ipynb python 机器学习文件类型后缀
  - 边写边运行
  - 科学计算
  
- finetuned
  - 微调 喂 CNN 数据
    文字类nlp 有优势
    专业,openai,还要有huggingface
  - large size model

1.
!pip install transformers

2.
# 引入 requests 模块 js fetch
import requests

3.
# 数据可视化
# 自动驾驶 纯视觉识别 画框框 图像识别
# 车牌识别
from PIL import Image
url = "https://d.musicapp.migu.cn/prod/playlist-service/playListimg/402bdb81-c298-4582-b208-543920fb8b08.jpg"

4.
# JS 和其他语言区别 重要 异步
# JS 不一样 网页端语言，JS单线程，一旦卡住 页面无法交互，JS 还要负责页面交互
result = requests.get(url,stream=True).raw
im = Image.open(result)
im

5.
from transformers import pipeline
# 模型
checkpoint = "google/owlvit-base-patch32"
detector = pipeline(model=checkpoint,task="zero-shot-object-detection")

6.
predictions = detector(
    im,
    candidate_labels=["boy"]
)
predictions