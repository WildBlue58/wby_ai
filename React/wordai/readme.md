# 智能前端之单词学习

- 产品和商业模式
  - 学单词
  - 拍照记单词
    - 图片交给多模态模型 Word
    - deepseek aigc 例句
    - tts 发音
- focus
  拍照背单词，用单词
- 解决一些特定的效率性、创新型App

- npm init vite
  vite 是工程化脚手架，构建工具
  - npm install 慢了点
  react ... 项目依赖
  pnpm 代替 npm
  不同的项目中 重复去安装了React
  React等包放到一个地方，如果之前安装过，链接过，只需要安装一次

## React 语法

- 单向数据流
  数据状态流动
  - 父组件负责提供数据，和 API 接口请求
  - 拆成多个子组件
  - 数据会从父组件流向子组件
  - 子组件负责消费数据 专注于显示，不关心数据来源
  - props
    <PictureCard
      uploadImage={uploadImage}
    /
    函数参数一样 可以解构

## 项目中一定要安排的技能点

- pnpm
- react 思想
  - 数据状态 useState
  - 数据驱动
  - 响应式 数据状态变化，视图会自动更新
    - 不用平凡操作DOM，只需要关注业务
  - 业务
    - 图片上传
      - 图片预览
- 组件化设计
  - App
    - 提供数据
    - 图片上传大模型
  - PictureCard
    单向数据流
    - 子组件只负责消费数据
    - 父组件负责提供数据，数据的请求
    - 先要给父组件
- 性能优化
  - linear-gradient 代替图片做背景
- 用户体验
  - 上传图片的功能，预览功能
  - 无障碍访问
    label for + input#id
- ES6 新特性
  - 可选链操作符
- HTML5 功能
  - file 文件对象
- 智能
  - 多模态模型
    ？ 月之暗面 base64
    prompt?
  - prompt 设计原则
    - 给它一个明确的身份 LLM交流 当人
    - 清晰且具体的任务
    - 限制，指定结果
      返回的结构 JSON
      有利于接下来的业务执行
      拿着大模型的回答，接着干活
      JSON 最好的接口格式
    - 分步做

{
  "image_discription": "A young man with black hair wearing a black shirt against a red background.",
  "representative_word": "portrait",
  "example_sentence": "The portrait shows a calm and composed young man.",
  "explanation": "Look at the image. It is a portrait of a person.\nA portrait is a picture of someone.\nThe person is standing in front of the camera.\nThe background is plain and colorful.\nThis type of picture is often used for identification or display.\nDo you have a portrait of yourself that you like?",
  "explanation_replys": ["Yes, I have a portrait that I took last year.", "I don't have a portrait, but I'd like to get one soon."]
}
